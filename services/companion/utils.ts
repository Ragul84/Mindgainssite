/**
 * Cleans AI responses that might be wrapped in ```json ... ``` blocks
 * or have conversational boilerplate before/after the JSON.
 */
export function cleanAIJSON(text: string): string {
  // 1. Remove markdown code blocks if present
  let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();

  // 2. Find the first occurrence of '{' or '[' and the last occurrence of '}' or ']'
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  const firstBracket = cleaned.indexOf('[');
  const lastBracket = cleaned.lastIndexOf(']');

  let start = -1;
  let end = -1;

  if (firstBrace !== -1 && (firstBracket === -1 || firstBrace < firstBracket)) {
    start = firstBrace;
    end = lastBrace;
  } else if (firstBracket !== -1) {
    start = firstBracket;
    end = lastBracket;
  }

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.substring(start, end + 1);
  }

  return cleaned;
}

import Constants from 'expo-constants';

type ModelStrength = 'cheap' | 'balanced' | 'strong';

type ChatMessage = { role: 'system' | 'user' | 'assistant'; content: string };

const OPENROUTER_KEY =
  process.env.EXPO_PUBLIC_OPENROUTER_API_KEY ||
  Constants.expoConfig?.extra?.EXPO_PUBLIC_OPENROUTER_API_KEY ||
  process.env.EXPO_PUBLIC_OPENAI_API_KEY || // fallback to keep flow running
  '';

const OPENROUTER_URL = 'https://openrouter.ai/api/v1/chat/completions';

const MODEL_MAP: Record<ModelStrength, { id: string; maxTokens: number }> = {
  cheap: { id: 'meta-llama/llama-3.2-3b-instruct', maxTokens: 750 },
  balanced: { id: 'google/gemini-2.0-flash-001', maxTokens: 1500 },
  strong: { id: 'anthropic/claude-3.5-sonnet', maxTokens: 2500 },
};

export type ModelRouterOptions = {
  strength?: ModelStrength;
  temperature?: number;
  maxTokens?: number;
  metadata?: Record<string, unknown>;
};

if (!OPENROUTER_KEY) {
  console.warn('[ModelRouter] Missing OpenRouter API key. Responses will be mocked.');
}

async function callOpenRouter(
  messages: ChatMessage[],
  options: ModelRouterOptions,
): Promise<string> {
  if (!OPENROUTER_KEY) {
    return '[Mocked Response] Please configure OpenRouter API key.';
  }

  const strength = options.strength ?? 'balanced';
  const model = MODEL_MAP[strength];

  const res = await fetch(OPENROUTER_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${OPENROUTER_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': 'https://mindgains.app',
      'X-Title': 'MindGains Companion',
    },
    body: JSON.stringify({
      model: model.id,
      max_tokens: options.maxTokens ?? model.maxTokens,
      temperature: options.temperature ?? (strength === 'strong' ? 0.8 : 0.65),
      messages,
    }),
  });

  if (!res.ok) {
    const errorPayload = await res.text();
    console.error('[ModelRouter] OpenRouter error', res.status, errorPayload);
    throw new Error('LLM routing failed');
  }

  const payload = await res.json();
  const content = payload?.choices?.[0]?.message?.content;
  if (!content) throw new Error('Invalid response from LLM');
  return content;
}

export const modelRouter = {
  async generate(
    messages: ChatMessage[],
    options: ModelRouterOptions = {},
  ): Promise<string> {
    return callOpenRouter(messages, options);
  },
};

export type RoutedPrompt = {
  systemPrompt: string;
  userPrompt: string;
  strength?: ModelStrength;
  temperature?: number;
  maxTokens?: number;
};

export async function runRoutedPrompt(prompt: RoutedPrompt): Promise<string> {
  return modelRouter.generate(
    [
      { role: 'system', content: prompt.systemPrompt },
      { role: 'user', content: prompt.userPrompt },
    ],
    {
      strength: prompt.strength,
      temperature: prompt.temperature,
      maxTokens: prompt.maxTokens,
    },
  );
}

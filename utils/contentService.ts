/**
 * contentService.ts
 *
 * Compatibility shim for legacy imports of `@/utils/contentService`.
 * The real data is fetched from Supabase via RealDatabaseContentService.
 * This stub provides the synchronous `getContentByTopicName` API that
 * `lesson-complete.tsx` expects, returning null so the screen falls back
 * to its built-in fallback flow gracefully.
 *
 * If you need richer content here in future, wire up the async
 * RealDatabaseContentService calls instead.
 */

export interface ContentSection {
  id: string;
  title: string;
  gradient: string[];
  content: {
    subtitle: string;
    color: string;
    points: string[];
  }[];
}

export interface TopicContent {
  topicName: string;
  sections: ContentSection[];
}

class ContentServiceClass {
  /**
   * Returns static/cached content for a given topic name.
   * Returns null to let callers fall back to their own defaults.
   */
  getContentByTopicName(_topicName: string): TopicContent | null {
    // Returning null intentionally — lesson-complete.tsx has a full
    // fallback flow that kicks in when this returns null.
    return null;
  }
}

export const ContentService = new ContentServiceClass();
export default ContentService;

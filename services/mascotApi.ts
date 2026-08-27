import { supabase, supabaseUrl, supabaseAnonKey } from '@/utils/supabase';
import { resolveStoryBaseUrlCandidates } from '@/utils/storyBaseUrl';

const fetchStoryWithFallback = async (path: string, init: RequestInit) => {
  const candidates = resolveStoryBaseUrlCandidates();
  let lastErr: any = null;
  for (const baseUrl of candidates) {
    try {
      const response = await fetch(`${baseUrl}${path}`, init);
      if (response.ok) return { response, baseUrl };
      lastErr = new Error(`HTTP ${response.status} for ${baseUrl}${path}`);
    } catch (err) {
      lastErr = err;
    }
  }
  throw lastErr || new Error(`Unable to reach story backend for ${path}`);
};

export interface MascotMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export const mascotApi = {
  /**
   * Stream a chat response from the backend.
   * Uses OpenRouter only (HuggingFace/PersonaPlex removed for simplicity)
   */
  async streamChat(
    userId: string,
    messages: { role: string; content: string }[],
    mode: 'chat' | 'study' = 'chat',
    onToken: (token: string) => void,
    onDone: (fullText: string) => void,
    onError: (err: any) => void
  ) {
    const { data: { session } } = await supabase.auth.getSession();
    const baseUrl = supabaseUrl;
    const anonKey = supabaseAnonKey;
    
    try {
      console.log(`🚀 Mascot API: POST to ${baseUrl}/functions/v1/miga_stream with mode: ${mode}`);
      
      const response = await fetch(`${baseUrl}/functions/v1/miga_stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({
          user_id: userId,
          messages,
          mode,
          provider: 'openrouter' // Always use OpenRouter
        })
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        console.error(`❌ Stream Error ${response.status}:`, errorText);
        throw new Error(`Stream error ${response.status}: ${errorText}`);
      }

      // 🔄 REACT NATIVE STREAMING FALLBACK
      if (!response.body || typeof (response.body as any).getReader !== 'function') {
        const text = await response.text();
        
        // Check if it's a direct JSON error or non-streamed response
        try {
            const directJson = JSON.parse(text);
            if (directJson.error) throw new Error(directJson.error);
            // If it's a simple text response (unlikely for stream, but possible)
            if (typeof directJson.content === 'string') {
                onToken(directJson.content);
                onDone(directJson.content);
                return;
            }
        } catch (e) {
            // Not a direct JSON object, proceed to parse stream chunks
        }

        const lines = text.split("\n");
        let fullContent = "";
        
        for (const line of lines) {
          if (line.trim().startsWith("data: ")) {
            const dataStr = line.trim().slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.token) {
                fullContent += parsed.token;
                onToken(parsed.token);
              }
            } catch (e) {
                // If chunk is partial, we might need more complex buffering, 
                // but for now, we assume lines are complete in fallback mode.
            }
          }
        }
        
        // If content is still empty, it might be that the server returned raw text without 'data:' prefix
        if (!fullContent && text.length > 0 && !text.includes("data: ")) {
            fullContent = text;
            onToken(text);
        }

        onDone(fullContent);
        return;
      }

      const reader = (response.body as any).getReader();
      const decoder = new TextDecoder();
      let fullContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const dataStr = line.slice(6).trim();
            if (dataStr === "[DONE]") continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.token) {
                fullContent += parsed.token;
                onToken(parsed.token);
              }
            } catch (e) {}
          }
        }
      }

      onDone(fullContent);

    } catch (err) {
      console.error("Mascot API Stream Error:", err);
      onError(err);
    }
  },

  /**
   * Get TTS audio for a text.
   */
  async getTTS(text: string): Promise<string> {
    const { data: { session } } = await supabase.auth.getSession();
    const anonKey = supabaseAnonKey;
    
    try {
      const { response, baseUrl } = await fetchStoryWithFallback('/edge_tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, speaker: 'en-IN-NeerjaNeural', speed: 1.0 })
      });
      console.log(`🚀 Mascot API: Attempting Local Edge-TTS at ${baseUrl}/edge_tts`);

      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (localErr) {
      // Fallback to Cloud Edge Function if local fails
      console.log(`⚠️ Local TTS failed or not running, falling back to Supabase Edge Function...`);
      const cloudResponse = await fetch(`${supabaseUrl}/functions/v1/miga_tts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ text })
      });

      if (!cloudResponse.ok) throw new Error(`Cloud TTS failure ${cloudResponse.status}`);
      const cloudBlob = await cloudResponse.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(cloudBlob);
      });
    }
  },

  /**
   * Start a world-class Pipecat session (WebRTC)
   */
  async startPipecatSession(userId: string): Promise<{ room_url: string; token: string }> {
    const { data: { session } } = await supabase.auth.getSession();
    const baseUrl = supabaseUrl;
    const anonKey = supabaseAnonKey;

    try {
      console.log(`🚀 Mascot API: Initializing Pipecat Session...`);
      const response = await fetch(`${baseUrl}/functions/v1/miga_pipecat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || anonKey}`,
          'apikey': anonKey,
        },
        body: JSON.stringify({ user_id: userId })
      });

      if (!response.ok) throw new Error(`Pipecat init failed ${response.status}`);
      return await response.json();
    } catch (err) {
      console.error("Pipecat Session Error:", err);
      throw err;
    }
  },

  /**
   * Upload a document for Story Mode RAG.
   */
  async uploadStoryDoc(file: any, sessionId?: string, title?: string): Promise<{ upload_id: string; status: string }> {
    try {
      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        name: file.name || 'upload.pdf',
        type: file.mimeType || 'application/pdf',
      } as any);
      if (sessionId) formData.append('session_id', sessionId);
      if (title) formData.append('title', title);

      const { response, baseUrl } = await fetchStoryWithFallback('/upload_story_doc', {
        method: 'POST',
        body: formData,
      });
      console.log(`🚀 Mascot API: Uploading doc to ${baseUrl}/upload_story_doc`);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Upload failed ${response.status}: ${errText}`);
      }

      return await response.json();
    } catch (err) {
      console.error("Doc Upload Error:", err);
      throw err;
    }
  },

  async uploadStoryUrl(url: string, urlType: 'youtube' | 'web' = 'youtube', sessionId?: string): Promise<{ upload_id: string; status: string }> {
    try {
      const { response, baseUrl } = await fetchStoryWithFallback('/upload_story_url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, url_type: urlType, session_id: sessionId }),
      });
      console.log(`🚀 Mascot API: Uploading URL to ${baseUrl}/upload_story_url`);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`URL Upload failed ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (err) {
      console.error("URL Upload Error:", err);
      throw err;
    }
  },

  async uploadStudyText(text: string, title: string, sessionId?: string): Promise<{ upload_id: string; status: string }> {
    try {
      const { response, baseUrl } = await fetchStoryWithFallback('/upload_study_text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, title, session_id: sessionId }),
      });
      console.log(`🚀 Mascot API: Uploading text to ${baseUrl}/upload_study_text`);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Text Upload failed ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (err) {
      console.error('Text Upload Error:', err);
      throw err;
    }
  },

  async generateStudyLabArtifact(request: {
    sessionId?: string;
    uploadId?: string | null;
    query: string;
    artifactType: 'podcast' | 'flashcards' | 'quiz' | 'summary' | 'mind_map';
    languageCode?: string;
    difficulty?: string;
    title?: string;
    sessionTitle?: string;
  }): Promise<{ success: boolean; artifact_type: string; data: any }> {
    const { response, baseUrl } = await fetchStoryWithFallback('/study_lab_generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: request.sessionId,
        upload_id: request.uploadId,
        query: request.query,
        artifact_type: request.artifactType,
        language_code: request.languageCode,
        difficulty: request.difficulty,
        title: request.title,
        session_title: request.sessionTitle,
      }),
    });
    console.log(`🚀 Mascot API: Generating Study Lab artifact at ${baseUrl}/study_lab_generate`);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Study Lab generation failed ${response.status}: ${errText}`);
    }
    return await response.json();
  },

  /**
   * Generate a story segment from RAG context.
   */
  async generateStorySegment(
    uploadId: string | null,
    query: string,
    languageCode: string = 'auto',
    sessionId?: string
  ): Promise<{ text: string; audio_url: string; anim_cues: any[]; choices?: string[]; visemes?: { time_ms: number; open: number; form: number; value?: string }[] }> {
    try {
      const payload: any = { query, language_code: languageCode };
      if (uploadId) payload.upload_id = uploadId;
      if (sessionId) payload.session_id = sessionId;
      const { response, baseUrl } = await fetchStoryWithFallback('/generate_story_segment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      console.log(`🚀 Mascot API: Generating Story Segment... ${baseUrl}/generate_story_segment`);

      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(`Generation failed ${response.status}: ${errText}`);
      }
      return await response.json();
    } catch (err) {
      console.error("Story Generation Error:", err);
      throw err;
    }
  },

  async generateStudyLabArtifactAsync(request: {
    sessionId?: string;
    uploadId?: string | null;
    query: string;
    artifactType: 'podcast' | 'flashcards' | 'quiz' | 'summary' | 'mind_map';
    languageCode?: string;
    difficulty?: string;
    title?: string;
    sessionTitle?: string;
  }): Promise<{ success: boolean; task_id: string; status: string; milestone: string }> {
    const { response, baseUrl } = await fetchStoryWithFallback('/study_lab_generate/async', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        session_id: request.sessionId,
        upload_id: request.uploadId,
        query: request.query,
        artifact_type: request.artifactType,
        language_code: request.languageCode,
        difficulty: request.difficulty,
        title: request.title,
        session_title: request.sessionTitle,
      }),
    });
    console.log(`🚀 Mascot API: POST /study_lab_generate/async at ${baseUrl}`);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Async Study Lab generation failed ${response.status}: ${errText}`);
    }
    return await response.json();
  },

  async getGenerationStatus(taskId: string): Promise<{
    task_id: string;
    status: 'queued' | 'processing' | 'completed' | 'failed' | 'cancelled';
    milestone: 'ingesting' | 'segmenting' | 'analyzing' | 'synthesizing' | 'ready' | 'cancelled' | 'failed';
    progress: number;
    error?: string;
    result?: { success: boolean; artifact_type: string; data: any };
  }> {
    const { response, baseUrl } = await fetchStoryWithFallback(`/generation_status/${taskId}`, {
      method: 'GET',
    });
    console.log(`🚀 Mascot API: GET /generation_status/${taskId} at ${baseUrl}`);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Failed to fetch generation status ${response.status}: ${errText}`);
    }
    return await response.json();
  },

  async cancelGeneration(taskId: string): Promise<{ success: boolean; task_id: string; status: string }> {
    const { response, baseUrl } = await fetchStoryWithFallback(`/cancel_generation/${taskId}`, {
      method: 'POST',
    });
    console.log(`🚀 Mascot API: POST /cancel_generation/${taskId} at ${baseUrl}`);
    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`Failed to cancel generation ${response.status}: ${errText}`);
    }
    return await response.json();
  }
};

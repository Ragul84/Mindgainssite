import { Platform } from 'react-native';
import Constants from 'expo-constants';

const DEFAULT_ANDROID = 'http://10.0.2.2:7860';
const DEFAULT_LOCAL = 'http://127.0.0.1:7860';

const normalizeHost = (raw?: string | null) => {
  if (!raw) return '';
  const trimmed = String(raw).trim();
  if (!trimmed) return '';
  const withoutScheme = trimmed.replace(/^[a-z]+:\/\//i, '');
  return withoutScheme.split(':')[0].split('/')[0];
};

export const resolveStoryBaseUrlCandidates = () => {
  const candidates: string[] = [];

  const envBase =
    process.env.EXPO_PUBLIC_STORY_BASE_URL ||
    Constants.expoConfig?.extra?.EXPO_PUBLIC_STORY_BASE_URL;
  if (envBase) candidates.push(envBase.replace(/\/$/, ''));

  const expoHost = normalizeHost(Constants.expoConfig?.hostUri);
  if (expoHost) candidates.push(`http://${expoHost}:7860`);

  const debuggerHost =
    normalizeHost((Constants as any)?.expoGoConfig?.debuggerHost) ||
    normalizeHost((Constants as any)?.manifest2?.debuggerHost) ||
    normalizeHost((Constants as any)?.manifest?.debuggerHost);
  if (debuggerHost) candidates.push(`http://${debuggerHost}:7860`);

  if (Platform.OS === 'android') candidates.push(DEFAULT_ANDROID);
  candidates.push(DEFAULT_LOCAL);

  return [...new Set(candidates)];
};

export const resolveStoryBaseUrl = () => {
  return resolveStoryBaseUrlCandidates()[0];
};

export const resolveStoryWebSocketUrl = () => {
  return resolveStoryBaseUrl().replace(/^http/, 'ws').replace(/\/$/, '');
};

export const resolveStoryWebSocketCandidates = () => {
  return resolveStoryBaseUrlCandidates().map((base) => base.replace(/^http/, 'ws').replace(/\/$/, ''));
};

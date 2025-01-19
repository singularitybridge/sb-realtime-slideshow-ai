export const openAIConfig = {
  model: "gpt-4o-realtime-preview-2024-12-17",
  voice: "shimmer",
  modalities: ["audio", "text"] as const,
  instructions: "You are a helpful assistant. Keep responses brief and clear.",
} as const;

// Type for the config to ensure type safety
export type OpenAIConfig = typeof openAIConfig;

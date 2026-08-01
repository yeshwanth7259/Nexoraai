export type ProviderName = "openai" | "runway" | "elevenlabs" | "fal";

export type AssetType = "image" | "video" | "audio" | "document";

export interface GenerateImageOptions {
  prompt: string;
  size?: string;
  quality?: string;
  style?: string;
  n?: number;
}

export interface GeneratedAssetResult {
  url: string;
  provider: ProviderName;
  tokensUsed?: number;
  costUsd?: number;
  metadata?: Record<string, any>;
}

export interface AIProviderAdapter {
  name: ProviderName;
  generateImage?: (options: GenerateImageOptions) => Promise<GeneratedAssetResult>;
  generateVideo?: (prompt: string, options?: any) => Promise<GeneratedAssetResult>;
  generateAudio?: (text: string, options?: any) => Promise<GeneratedAssetResult>;
  transcribeAudio?: (audioFileUrl: string) => Promise<string>;
}

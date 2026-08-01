export interface PromptEnhanceOptions {
  basePrompt: string;
  style?: string;
  mood?: string;
  aspectRatio?: string;
}

export function buildImagePrompt(options: PromptEnhanceOptions): string {
  const parts = [options.basePrompt];

  if (options.style) {
    parts.push(`Style: ${options.style}.`);
  }

  if (options.mood) {
    parts.push(`Mood/Lighting: ${options.mood}.`);
  }

  // Instruct the AI model about resolution framing
  if (options.aspectRatio) {
    parts.push(`(Optimized for ${options.aspectRatio} aspect ratio).`);
  }

  return parts.join(" ");
}

/**
 * In a full production environment, this would call GPT-4o-mini
 * to expand a short prompt into a highly detailed image generation prompt.
 */
export async function enhancePromptWithGPT(shortPrompt: string): Promise<string> {
  // Mocking the prompt enhancement for Milestone 1. 
  // We can hook this into the AI Gateway Chat module later.
  return `${shortPrompt}, highly detailed, 8k resolution, cinematic lighting, masterpiece, trending on artstation.`;
}

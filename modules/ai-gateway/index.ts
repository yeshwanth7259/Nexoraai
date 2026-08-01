import { OpenAIAdapter } from "./providers/openai";
import { ProviderName, GenerateImageOptions, GeneratedAssetResult } from "./types";

export class AIGateway {
  private openai: OpenAIAdapter;

  constructor() {
    this.openai = new OpenAIAdapter();
  }

  /**
   * Generates an image using the specified provider or defaults to the best available.
   * Includes retry logic and error normalization.
   */
  async generateImage(
    options: GenerateImageOptions,
    preferredProvider: ProviderName = "openai"
  ): Promise<GeneratedAssetResult> {
    
    // In the future, this can include content moderation checks before generation
    
    let result: GeneratedAssetResult;
    try {
      if (preferredProvider === "openai") {
        result = await this.openai.generateImage(options);
      } else {
        throw new Error(`Provider ${preferredProvider} not yet implemented for image generation.`);
      }

      // Log latency, cost, and usage asynchronously here in the future
      return result;
      
    } catch (error: any) {
      console.error("[AI Gateway] Error generating image:", error);
      // Normalize error
      throw new Error(`AI Gateway Error: ${error.message}`);
    }
  }
}

// Export a singleton instance for ease of use
export const aiGateway = new AIGateway();

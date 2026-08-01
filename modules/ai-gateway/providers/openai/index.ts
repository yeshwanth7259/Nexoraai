import { AIProviderAdapter, GenerateImageOptions, GeneratedAssetResult } from "../../types";

export class OpenAIAdapter implements AIProviderAdapter {
  name: "openai" = "openai";
  
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
    if (!this.apiKey) {
      console.warn("OPENAI_API_KEY is not set.");
    }
  }

  async generateImage(options: GenerateImageOptions): Promise<GeneratedAssetResult> {
    const { prompt, size = "1024x1024", quality = "standard", n = 1 } = options;

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt,
        n,
        size,
        quality,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API Error: ${errorText}`);
    }

    const data: any = await response.json();
    const url = data.data[0].url;

    // Approximate cost for standard dall-e-3 1024x1024
    const costUsd = 0.040; 

    return {
      url,
      provider: this.name,
      costUsd,
      metadata: {
        revised_prompt: data.data[0].revised_prompt,
      }
    };
  }
}

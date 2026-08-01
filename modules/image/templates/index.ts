export interface PromptTemplate {
  id: string;
  category: string;
  title: string;
  description: string;
  basePrompt: string;
}

export const imageTemplates: PromptTemplate[] = [
  {
    id: "marketing-poster",
    category: "Marketing",
    title: "Diwali Sale Poster",
    description: "A vibrant festival sale poster.",
    basePrompt: "A high-quality, professional marketing poster for a Diwali sale. Vibrant colors, festive atmosphere, modern typography placeholder space, featuring glowing diyas and fireworks in the background."
  },
  {
    id: "social-instagram",
    category: "Social Media",
    title: "Instagram Product Showcase",
    description: "Clean aesthetic product background.",
    basePrompt: "A minimalist Instagram post background for a product showcase. Soft pastel colors, studio lighting, empty podium in the center, modern and clean aesthetic, 4k resolution."
  },
  {
    id: "business-logo",
    category: "Business",
    title: "Modern Tech Logo",
    description: "Sleek startup logo concept.",
    basePrompt: "A flat, minimalist vector logo design for a modern tech startup. Clean lines, geometric shapes, gradient colors, white background, professional and sleek."
  },
  {
    id: "youtube-thumbnail",
    category: "Social Media",
    title: "Gaming Thumbnail Background",
    description: "High-contrast dynamic background.",
    basePrompt: "An intense, high-contrast YouTube thumbnail background for a gaming video. Neon lights, dark atmosphere, dynamic angles, blurred action in the background."
  }
];

import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";

// Set worker source for pdfjs from CDN to avoid Next.js bundling issues with web workers
if (typeof window !== "undefined") {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
}

export async function parseFileToText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();

  try {
    if (extension === "pdf") {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map((item: any) => item.str).join(" ");
        fullText += pageText + "\n";
      }
      return fullText;
    } 
    else if (extension === "docx") {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } 
    else {
      // Fallback for .txt, .md, .csv, .json, .html, .css, etc.
      return await file.text();
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error(`Could not parse ${extension?.toUpperCase()} file.`);
  }
}

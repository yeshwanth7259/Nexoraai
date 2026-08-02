export async function parseFileToText(file: File): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase();
  const mimeType = file.type;

  try {
    if (extension === "pdf" || mimeType === "application/pdf") {
      const pdfjsLib = await import("pdfjs-dist");
      
      if (typeof window !== "undefined") {
        pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
      }

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
    else if (extension === "docx" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const mammoth = (await import("mammoth")).default;
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    } 
    else {
      // Check if it's a known text format, otherwise reject to prevent sending raw binary garbage
      if (mimeType.startsWith("text/") || mimeType === "application/json" || ["txt", "md", "csv", "json", "js", "ts", "jsx", "tsx", "html", "css"].includes(extension || "")) {
        return await file.text();
      } else {
        throw new Error(`Unsupported file type: ${file.name}. Please upload a PDF, DOCX, or text file.`);
      }
    }
  } catch (error) {
    console.error("Error parsing file:", error);
    throw new Error(`Could not parse ${file.name}. Please ensure it is a valid document.`);
  }
}

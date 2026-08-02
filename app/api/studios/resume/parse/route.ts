import { NextResponse } from 'next/server';
import mammoth from 'mammoth';

export const runtime = 'nodejs'; // Use Node.js runtime for pdf-parse and mammoth

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const extension = file.name.split('.').pop()?.toLowerCase();
    const mimeType = file.type;

    let text = "";

    if (extension === "pdf" || mimeType === "application/pdf") {
      const pdfParse = require('pdf-parse/lib/pdf-parse.js');
      const data = await pdfParse(buffer);
      text = data.text;
    } 
    else if (extension === "docx" || mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    } 
    else if (mimeType.startsWith("text/") || ["txt", "md", "csv", "json"].includes(extension || "")) {
      text = buffer.toString('utf-8');
    }
    else {
      return NextResponse.json({ error: `Unsupported file type: ${file.name}. Please upload a PDF, DOCX, or text file.` }, { status: 400 });
    }

    if (!text.trim()) {
      return NextResponse.json({ error: "Could not extract text from this document. It might be empty or scanned." }, { status: 400 });
    }

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Parse API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse document" }, { status: 500 });
  }
}

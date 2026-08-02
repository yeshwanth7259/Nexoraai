export async function parseFileToText(file: File): Promise<string> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/studios/resume/parse", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Could not parse ${file.name}`);
    }

    return data.text;
  } catch (error: any) {
    console.error("Error parsing file:", error);
    throw new Error(error.message || `Could not parse ${file.name}. Please ensure it is a valid document.`);
  }
}

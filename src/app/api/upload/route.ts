import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readBody(req: Request): Promise<Buffer> {
  const chunks: Uint8Array[] = [];
  const reader = req.body?.getReader();
  if (!reader) return Buffer.from([]);
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  try {
    const formData = await readBody(req);
    const text = formData.toString("utf-8");

    const nameMatch = text.match(/name="file"\r\n\r\n([\s\S]*?)\r\n/);
    const filenameMatch = text.match(/filename="([^"]+)"/);

    let raw: string;
    let filename: string;

    if (nameMatch && filenameMatch) {
      raw = nameMatch[1];
      filename = filenameMatch[1];
    } else {
      return NextResponse.json({ error: "Invalid upload" }, { status: 400 });
    }

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const ext = path.extname(filename).toLowerCase();
    const allowed = [".jpeg", ".jpg", ".png", ".webp"];
    if (!allowed.includes(ext)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const dataStart = text.indexOf(raw);
    const dataEnd = text.lastIndexOf("\r\n");
    const base64 = text.slice(dataStart, dataEnd > dataStart ? dataEnd : undefined).trim();

    const buffer = Buffer.from(base64, "base64");
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const dest = path.join(PUBLIC_DIR, safeName);

    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.writeFileSync(dest, buffer);

    return NextResponse.json({ path: `/${safeName}` });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

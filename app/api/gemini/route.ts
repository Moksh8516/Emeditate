// app/api/gemini/route.ts
import { NextRequest, NextResponse } from "next/server";
import { GeminiResponse } from "@/lib/gemini";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();
  if (!prompt) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }
  try {
    const reply = await GeminiResponse(prompt);
    console.log(reply +" reply")
    return  NextResponse.json({ message:reply });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Error generating response";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

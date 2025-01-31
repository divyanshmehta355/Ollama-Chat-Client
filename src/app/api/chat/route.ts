import { NextResponse } from "next/server";
import ollama from "ollama";

export async function POST(req: Request) {
  const { message } = await req.json();

  const stream = new ReadableStream({
    async start(controller) {
      const response = await ollama.chat({
        model: "deepseek-r1",
        messages: [{ role: "user", content: message }],
        stream: true,
      });

      for await (const part of response) {
        controller.enqueue(new TextEncoder().encode(part.message.content));
      }
      controller.close();
    },
  });

  return new NextResponse(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
    },
  });
}

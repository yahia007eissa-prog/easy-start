import { NextRequest, NextResponse } from "next/server";
import { deepseek, DEEPSEEK_MODEL } from "@/lib/ai/deepseek";
import { getEdgeSystemPrompt } from "@/lib/ai/system-prompts/edge-prompts";
import type { ProjectCategory } from "@/lib/ai/system-prompts/dynamic-prompts";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, projectContext, category } = body;

    const projectCategory = (category as ProjectCategory) || 'realEstate';
    const systemPrompt = getEdgeSystemPrompt(projectCategory);

    const contextPrompt = projectContext?.projectName
      ? `\n\nالسياق: أنت تساعد حالياً في مشروع "${projectContext.projectName}" (${projectContext.projectType || projectCategory}).`
      : "";

    const systemMessages = [
      { role: "system" as const, content: `${systemPrompt}${contextPrompt}` },
      ...messages,
    ];

    const stream = await deepseek.chat.completions.create({
      model: DEEPSEEK_MODEL,
      messages: systemMessages,
      temperature: 0.7,
      max_tokens: 2000,
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || '';
          if (text) {
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ delta: text })}\n\n`));
          }
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'));
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 },
    );
  }
}

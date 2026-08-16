import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@/app/lib/prisma";
import { anthropic, CLAUDE_MODEL, SYSTEM_PROMPT } from "@/app/lib/anthropic";
import { Role } from "@/app/generated/prisma/enums";
import { getCurrentUser, getOwnedConversation } from "@/app/lib/dal";

const TITLE_MAX_LENGTH = 60;
const DEFAULT_TITLE = "New conversation";

function titleFromMessage(content: string): string {
  const trimmed = content.trim().replace(/\s+/g, " ");
  if (!trimmed) return DEFAULT_TITLE;
  if (trimmed.length <= TITLE_MAX_LENGTH) return trimmed;
  return `${trimmed.slice(0, TITLE_MAX_LENGTH).trimEnd()}…`;
}

export async function POST(
  request: Request,
  ctx: RouteContext<"/api/conversations/[id]/messages">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: conversationId } = await ctx.params;
  const conversation = await getOwnedConversation(conversationId);
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await request.json().catch(() => null);
  const content = typeof body?.content === "string" ? body.content.trim() : "";
  if (!content) {
    return NextResponse.json({ error: "Message content is required" }, { status: 400 });
  }

  // Save the user message before calling Claude - it must never be lost
  // even if the Claude API call fails afterwards.
  const userMessage = await prisma.message.create({
    data: { conversationId, role: Role.USER, content },
  });

  if (conversation.title === DEFAULT_TITLE) {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { title: titleFromMessage(content), updatedAt: new Date() },
    });
  } else {
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });
  }

  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  try {
    const response = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages: history.map((message) => ({
        role: message.role === Role.USER ? ("user" as const) : ("assistant" as const),
        content: message.content,
      })),
    });

    if (response.stop_reason === "refusal") {
      return NextResponse.json(
        { userMessage, error: "The assistant declined to respond to this message." },
        { status: 422 },
      );
    }

    const text = response.content
      .filter((block) => block.type === "text")
      .map((block) => block.text)
      .join("\n")
      .trim();

    if (!text) {
      return NextResponse.json(
        { userMessage, error: "The assistant returned an empty response." },
        { status: 502 },
      );
    }

    // Only save the assistant message once we have a complete, successful response.
    const assistantMessage = await prisma.message.create({
      data: { conversationId, role: Role.ASSISTANT, content: text },
    });

    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ userMessage, assistantMessage });
  } catch (error) {
    const message =
      error instanceof Anthropic.APIError
        ? `Claude API error: ${error.message}`
        : "Failed to reach the Claude API";

    return NextResponse.json({ userMessage, error: message }, { status: 502 });
  }
}

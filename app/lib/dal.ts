import "server-only";
import { cache } from "react";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

/**
 * Returns the authenticated user (scoped to session.userId) or null.
 * Use this as the entry point for any query that needs the current user -
 * never trust a userId passed from the client.
 */
export const getCurrentUser = cache(async () => {
  const session = await getSession();
  if (!session?.userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true },
  });

  return user;
});

/**
 * Returns the current user's conversations, most recently updated first.
 * Scoped to session.userId - never accepts a userId from the caller.
 */
export async function listConversations() {
  const user = await getCurrentUser();
  if (!user) return [];

  return prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
}

/**
 * Creates a new conversation owned by the current user.
 */
export async function createConversation(title: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.conversation.create({
    data: { userId: user.id, title },
  });
}

/**
 * Returns the conversation only if it exists and belongs to the current
 * user. Every route that touches a conversation or its messages must go
 * through this - never look up a Conversation/Message by id alone.
 */
export async function getOwnedConversation(conversationId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
  });
}

/**
 * Returns the conversation with its messages (oldest first), scoped to the
 * current user. Returns null if the conversation doesn't exist or isn't
 * owned by the current user.
 */
export async function getConversationWithMessages(conversationId: string) {
  const user = await getCurrentUser();
  if (!user) return null;

  return prisma.conversation.findFirst({
    where: { id: conversationId, userId: user.id },
    include: {
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
}

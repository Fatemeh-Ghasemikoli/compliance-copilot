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

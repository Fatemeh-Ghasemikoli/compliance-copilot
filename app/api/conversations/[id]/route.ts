import { NextResponse } from "next/server";
import { getCurrentUser, getConversationWithMessages } from "@/app/lib/dal";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/api/conversations/[id]">,
) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await ctx.params;
  const conversation = await getConversationWithMessages(id);
  if (!conversation) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ conversation });
}

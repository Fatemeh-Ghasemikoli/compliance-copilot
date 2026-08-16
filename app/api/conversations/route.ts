import { NextResponse } from "next/server";
import { getCurrentUser, listConversations, createConversation } from "@/app/lib/dal";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversations = await listConversations();
  return NextResponse.json({ conversations });
}

export async function POST() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const conversation = await createConversation("New conversation");
  if (!conversation) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ conversation }, { status: 201 });
}

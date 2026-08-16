import { notFound } from "next/navigation";
import { getConversationWithMessages } from "@/app/lib/dal";
import { ChatView } from "../chat-view";

export default async function ConversationPage({
  params,
}: PageProps<"/chat/[id]">) {
  const { id } = await params;
  const conversation = await getConversationWithMessages(id);

  if (!conversation) {
    notFound();
  }

  return (
    <ChatView
      conversationId={conversation.id}
      initialMessages={conversation.messages.map((message) => ({
        id: message.id,
        role: message.role,
        content: message.content,
      }))}
    />
  );
}

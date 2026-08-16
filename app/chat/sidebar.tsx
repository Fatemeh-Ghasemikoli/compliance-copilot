import Link from "next/link";
import type { listConversations } from "@/app/lib/dal";
import { NewConversationButton } from "./new-conversation-button";

type Conversations = Awaited<ReturnType<typeof listConversations>>;

export function Sidebar({ conversations }: { conversations: Conversations }) {
  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="p-3">
        <NewConversationButton />
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-1">
        {conversations.length === 0 && (
          <p className="px-2 text-sm text-zinc-500">No conversations yet.</p>
        )}
        {conversations.map((conversation) => (
          <Link
            key={conversation.id}
            href={`/chat/${conversation.id}`}
            className="rounded px-2 py-2 text-sm truncate hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            {conversation.title}
          </Link>
        ))}
      </nav>
    </div>
  );
}

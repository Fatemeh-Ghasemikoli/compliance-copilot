"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { listConversations } from "@/app/lib/dal";
import { NewConversationButton } from "./new-conversation-button";

type Conversations = Awaited<ReturnType<typeof listConversations>>;

export function Sidebar({ conversations }: { conversations: Conversations }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="p-3">
        <NewConversationButton />
      </div>
      <nav className="flex-1 overflow-y-auto px-2 pb-3 flex flex-col gap-0.5">
        {conversations.length === 0 && (
          <p className="px-2 py-2 text-sm text-sidebar-foreground/50">
            No conversations yet.
          </p>
        )}
        {conversations.map((conversation) => {
          const active = pathname === `/chat/${conversation.id}`;
          return (
            <Link
              key={conversation.id}
              href={`/chat/${conversation.id}`}
              className={`rounded-md px-2.5 py-2 text-sm truncate transition-colors ${
                active
                  ? "bg-sidebar-active text-sidebar-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-hover hover:text-sidebar-foreground"
              }`}
            >
              {conversation.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

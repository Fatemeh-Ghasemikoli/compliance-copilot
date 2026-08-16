"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NewConversationButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    try {
      const response = await fetch("/api/conversations", { method: "POST" });
      if (!response.ok) return;
      const data = await response.json();
      router.push(`/chat/${data.conversation.id}`);
      router.refresh();
    } finally {
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={pending}
      className="w-full flex items-center justify-center gap-1.5 rounded-md bg-accent text-accent-foreground px-3 py-2 text-sm font-medium transition-colors hover:bg-accent-hover disabled:opacity-50"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        className="size-4"
        aria-hidden="true"
      >
        <path d="M12 5v14M5 12h14" />
      </svg>
      {pending ? "Creating..." : "New chat"}
    </button>
  );
}

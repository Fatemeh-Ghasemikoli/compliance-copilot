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
      className="w-full bg-black text-white rounded px-3 py-2 text-sm disabled:opacity-50"
    >
      {pending ? "Creating..." : "New chat"}
    </button>
  );
}

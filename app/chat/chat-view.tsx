"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

export function ChatView({
  conversationId,
  initialMessages,
}: {
  conversationId: string;
  initialMessages: ChatMessage[];
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();
    if (!content || sending) return;

    setSending(true);
    setError(null);
    setInput("");

    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      const data = await response.json().catch(() => null);

      if (!data) {
        setError("Something went wrong. Please try again.");
        return;
      }

      // The user message is saved server-side even if Claude fails, so
      // always show it - only the assistant reply is conditional.
      if (data.userMessage) {
        setMessages((prev) => [...prev, data.userMessage]);
      }

      if (!response.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setMessages((prev) => [...prev, data.assistantMessage]);
      router.refresh(); // updates the sidebar (title/order) with fresh server data
    } catch {
      setError("Failed to reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
        {messages.length === 0 && (
          <p className="text-sm text-zinc-500">Send a message to start the conversation.</p>
        )}
        {messages.map((message) => (
          <div
            key={message.id}
            className={`max-w-2xl whitespace-pre-wrap rounded px-3 py-2 text-sm ${
              message.role === "USER"
                ? "self-end bg-black text-white"
                : "self-start bg-zinc-100 dark:bg-zinc-800"
            }`}
          >
            {message.content}
          </div>
        ))}
        {sending && (
          <div className="self-start rounded px-3 py-2 text-sm text-zinc-500">
            Thinking...
          </div>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>

      <form onSubmit={handleSubmit} className="border-t p-3 flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Send a message..."
          disabled={sending}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="bg-black text-white rounded px-4 py-2 text-sm disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

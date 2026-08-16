"use client";

import { useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

export interface ChatMessage {
  id: string;
  role: "USER" | "ASSISTANT";
  content: string;
}

const EXAMPLE_PROMPTS = [
  "Summarize the key requirements of SOC 2 Type II",
  "Draft a data retention policy outline",
  "Explain the difference between GDPR and CCPA",
];

const markdownComponents: Components = {
  p: ({ children }) => <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>,
  h1: ({ children }) => (
    <h1 className="mb-2 mt-4 first:mt-0 text-base font-semibold">{children}</h1>
  ),
  h2: ({ children }) => (
    <h2 className="mb-2 mt-4 first:mt-0 text-base font-semibold">{children}</h2>
  ),
  h3: ({ children }) => (
    <h3 className="mb-2 mt-3 first:mt-0 text-sm font-semibold">{children}</h3>
  ),
  ul: ({ children }) => (
    <ul className="mb-3 last:mb-0 list-disc pl-5 space-y-1">{children}</ul>
  ),
  ol: ({ children }) => (
    <ol className="mb-3 last:mb-0 list-decimal pl-5 space-y-1">{children}</ol>
  ),
  li: ({ children }) => <li className="leading-relaxed">{children}</li>,
  a: ({ children, href }) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline underline-offset-2 hover:text-accent-hover"
    >
      {children}
    </a>
  ),
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
  blockquote: ({ children }) => (
    <blockquote className="mb-3 last:mb-0 border-l-2 border-zinc-300 pl-3 text-zinc-600 dark:border-zinc-600 dark:text-zinc-400">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-3 border-zinc-200 dark:border-zinc-700" />,
  code: ({ className, children }) => {
    const isBlock = className?.includes("language-");
    if (isBlock) {
      return <code className={className}>{children}</code>;
    }
    return (
      <code className="rounded bg-zinc-100 px-1 py-0.5 font-mono text-[0.85em] dark:bg-zinc-800">
        {children}
      </code>
    );
  },
  pre: ({ children }) => (
    <pre className="mb-3 last:mb-0 overflow-x-auto rounded-md bg-zinc-100 p-3 font-mono text-[0.85em] dark:bg-zinc-800">
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="mb-3 last:mb-0 overflow-x-auto">
      <table className="w-full border-collapse text-sm">{children}</table>
    </div>
  ),
  th: ({ children }) => (
    <th className="border border-zinc-200 bg-zinc-50 px-2 py-1 text-left font-medium dark:border-zinc-700 dark:bg-zinc-800">
      {children}
    </th>
  ),
  td: ({ children }) => (
    <td className="border border-zinc-200 px-2 py-1 align-top dark:border-zinc-700">
      {children}
    </td>
  ),
};

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 self-start rounded-2xl border border-zinc-200 bg-white px-4 py-3 dark:border-zinc-800 dark:bg-zinc-900">
      <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]" />
      <span className="size-1.5 animate-bounce rounded-full bg-zinc-400" />
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (prompt: string) => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="size-10 text-zinc-300 dark:text-zinc-700"
        aria-hidden="true"
      >
        <path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
      <div>
        <p className="font-medium text-zinc-700 dark:text-zinc-300">
          Start the conversation
        </p>
        <p className="text-sm text-zinc-500">
          Ask a compliance or security question to get started.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        {EXAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPick(prompt)}
            className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs text-zinc-600 transition-colors hover:border-accent hover:text-accent dark:border-zinc-700 dark:text-zinc-400"
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
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
  const formRef = useRef<HTMLFormElement>(null);

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

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      formRef.current?.requestSubmit();
    }
  }

  return (
    <div className="flex flex-1 flex-col min-h-0">
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <EmptyState onPick={setInput} />
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-5 px-4 py-6">
            {messages.map((message) => {
              const isUser = message.role === "USER";
              return (
                <div
                  key={message.id}
                  className={`flex max-w-[85%] flex-col gap-1 ${
                    isUser ? "self-end items-end" : "self-start items-start"
                  }`}
                >
                  <span className="px-1 text-xs font-medium text-zinc-400">
                    {isUser ? "You" : "Compliance Copilot"}
                  </span>
                  {isUser ? (
                    <div className="whitespace-pre-wrap rounded-2xl bg-accent px-4 py-2.5 text-sm text-accent-foreground">
                      {message.content}
                    </div>
                  ) : (
                    <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200">
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                  )}
                </div>
              );
            })}
            {sending && <TypingIndicator />}
            {error && (
              <div className="self-start rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-zinc-200 px-4 py-3 dark:border-zinc-800">
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="mx-auto flex max-w-3xl items-end gap-2 rounded-2xl border border-zinc-200 bg-white p-2 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
        >
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a compliance or security question..."
            disabled={sending}
            rows={1}
            className="max-h-40 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm outline-none placeholder:text-zinc-400"
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex shrink-0 items-center justify-center rounded-full bg-accent p-2 text-accent-foreground transition-colors hover:bg-accent-hover disabled:opacity-40"
          >
            {sending ? (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="size-4 animate-spin"
                aria-hidden="true"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeOpacity="0.25"
                />
                <path
                  d="M21 12a9 9 0 0 0-9-9"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-4"
                aria-hidden="true"
              >
                <path d="M12 19V5" />
                <path d="m5 12 7-7 7 7" />
              </svg>
            )}
            <span className="sr-only">Send</span>
          </button>
        </form>
        <p className="mx-auto mt-2 max-w-3xl px-1 text-xs text-zinc-400">
          Compliance Copilot can make mistakes. Verify important information.
        </p>
      </div>
    </div>
  );
}

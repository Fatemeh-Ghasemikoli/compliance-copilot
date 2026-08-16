export default function ChatPage() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 text-center">
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
          No conversation selected
        </p>
        <p className="text-sm text-zinc-500">
          Select a conversation from the sidebar or start a new one.
        </p>
      </div>
    </div>
  );
}

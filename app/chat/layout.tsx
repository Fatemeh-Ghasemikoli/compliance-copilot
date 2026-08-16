import { redirect } from "next/navigation";
import { getCurrentUser, listConversations } from "@/app/lib/dal";
import { LogoutButton } from "./logout-button";
import { Sidebar } from "./sidebar";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const conversations = await listConversations();

  const initial = user.name?.trim().charAt(0).toUpperCase() || "?";

  return (
    <div className="flex flex-1 min-h-0">
      <aside className="w-64 shrink-0 flex flex-col bg-sidebar-background text-sidebar-foreground">
        <div className="flex items-center gap-2 px-4 py-4 border-b border-sidebar-border">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            className="size-5 shrink-0 text-accent"
            aria-hidden="true"
          >
            <path d="M12 2 4 5v6c0 5 3.4 8.4 8 11 4.6-2.6 8-6 8-11V5l-8-3Z" />
            <path d="m9 12 2 2 4-4" />
          </svg>
          <span className="text-sm font-semibold tracking-tight truncate">
            Compliance Copilot
          </span>
        </div>
        <Sidebar conversations={conversations} />
        <div className="flex items-center justify-between gap-2 px-3 py-3 border-t border-sidebar-border">
          <div className="flex items-center gap-2 min-w-0">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-sidebar-active text-xs font-medium text-sidebar-foreground">
              {initial}
            </span>
            <span className="text-sm truncate">{user.name}</span>
          </div>
          <LogoutButton />
        </div>
      </aside>
      <main className="flex flex-1 min-w-0 flex-col bg-background">{children}</main>
    </div>
  );
}

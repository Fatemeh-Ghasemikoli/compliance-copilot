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

  return (
    <div className="flex flex-1 min-h-0">
      <aside className="w-64 shrink-0 border-r flex flex-col">
        <div className="flex items-center justify-between px-3 py-3 border-b">
          <span className="text-sm font-medium truncate">{user.name}</span>
          <LogoutButton />
        </div>
        <Sidebar conversations={conversations} />
      </aside>
      <main className="flex flex-1 min-w-0 flex-col">{children}</main>
    </div>
  );
}

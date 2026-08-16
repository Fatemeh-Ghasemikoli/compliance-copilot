import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/dal";
import { LogoutButton } from "./logout-button";

export default async function ChatPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-2xl font-semibold">Welcome, {user.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Chat functionality coming soon.
      </p>
      <LogoutButton />
    </div>
  );
}

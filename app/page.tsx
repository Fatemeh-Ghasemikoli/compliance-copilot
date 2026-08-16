import { redirect } from "next/navigation";
import { getCurrentUser } from "@/app/lib/dal";

export default async function Home() {
  const user = await getCurrentUser();

  if (user) {
    redirect("/chat");
  }

  redirect("/login");
}
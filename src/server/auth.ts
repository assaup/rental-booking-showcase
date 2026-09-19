import { cookies } from "next/headers";
import { sessions } from "./mock/users";


export async function getSessionUserId(): Promise<string | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token) return null;

  return sessions.get(token) ?? null;
}
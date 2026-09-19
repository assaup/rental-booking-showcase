import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { sessions } from "@/server/mock/users";

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (token) sessions.delete(token);

  cookieStore.delete("session");

  return NextResponse.json({ ok: true });
}

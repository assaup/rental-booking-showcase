import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { users, sessions } from "@/server/mock/users";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("session")?.value;

  if (!token){
    return NextResponse.json(
      { message: "Не авторизован" },
      { status: 401 },
    );
  }
  const userId = sessions.get(token)
  if (!userId) {
    return NextResponse.json(
      { message: "Не авторизован" },
      { status: 401 },
    ); 
  }
  const user = users.find((u) => u.id === userId)
  if (!user){
    return NextResponse.json(
      { message: "Не авторизован" },
      { status: 401 },
    ); 
  }

  const { password: _, ...safeUser } = user

  return NextResponse.json({ user: safeUser })
}
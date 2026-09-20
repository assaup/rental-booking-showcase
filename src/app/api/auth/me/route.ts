import { NextResponse } from "next/server";
import { users } from "@/server/mock/users";
import { getSessionUserId } from "@/server/auth";

export async function GET() {
  const userId = await getSessionUserId()

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
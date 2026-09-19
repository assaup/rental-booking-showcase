import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { users, sessions } from "@/server/mock/users";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { message: "Некорректные данные", issues: parsed.error.issues },
      { status: 400 },
    );
  }
  const user = users.find((u) => u.email === parsed.data.email);
  if (!user || user.password !== parsed.data.password) {
    return NextResponse.json(
      { message: "Неверный email или пароль" },
      { status: 401 },
    );
  }
  const { password: _, ...safeUser } = user;
  const token = crypto.randomUUID();

  sessions.set(token, user.id);

  const cookieStore = await cookies();

  cookieStore.set("session", token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: 60 * 60 * 24,
    path: "/",
  });

  return Response.json({ user: safeUser })

}

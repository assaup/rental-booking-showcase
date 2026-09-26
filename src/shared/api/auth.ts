import z from "zod";
import { BASE_URL } from "./config";
import { ApiError } from "./error";

export interface User {
  id: string;
  email: string;
  name: string;
}

export const LoginDataSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});

export async function login(email: string, password: string): Promise<User> {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new ApiError(
      res.status,
      body?.message ?? `Ошибка ${res.status}`,
      body,
    );
  }
  const data = await res.json();
  return data.user;
}

export async function logout(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/auth/logout`, {
    method: "POST",
  });
  if (!res.ok) {
    throw new ApiError(res.status, "Не удалось выйти");
  }
  const data = await res.json();
  return data;
}

export async function fetchMe(): Promise<User | null> {
  const res = await fetch(`${BASE_URL}/api/auth/me`, { cache: "no-store" });

  if (res.status === 401) return null;
  if (!res.ok) {
    throw new ApiError(res.status, `Ошибка ${res.status}`);
  }

  const data = await res.json();
  return data.user;
}

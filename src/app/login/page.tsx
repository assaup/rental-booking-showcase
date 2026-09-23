"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/shared/auth/AuthProvider";
import { LoginForm } from "../_components/LoginForm/LoginForm";
import styles from "./page.module.scss";

export default function LoginPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirectTo = searchParams.get("from") ?? "/";

  // уже вошёл — незачем показывать форму
  useEffect(() => {
    if (!loading && user) {
      router.replace(redirectTo);
    }
  }, [loading, user, redirectTo, router]);

  return (
    <main className={styles.page}>
      <div className={styles.card}>
        <p className={styles.eyebrow}>Северный прокат</p>
        <h1 className={styles.title}>Вход в аккаунт</h1>
        <p className={styles.subtitle}>
          Нужен, чтобы подтвердить бронь и видеть историю заказов.
        </p>

        <LoginForm onSuccess={() => router.replace(redirectTo)} />

        <p className={styles.demo}>
          Демо-доступ: <code>samir@mail.ru</code> / <code>123456</code>
        </p>
      </div>
    </main>
  );
}

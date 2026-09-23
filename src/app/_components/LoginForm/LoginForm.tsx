"use client";

import { useAuth } from "@/shared/auth/AuthProvider";
import { ApiError } from "@/shared/api/error";
import { useState, type SyntheticEvent } from "react";
import { z } from "zod";
import styles from "./LoginForm.module.scss";

const LoginDataSchema = z.object({
  email: z.string().email("Введите корректный email"),
  password: z.string().min(1, "Введите пароль"),
});
interface Props {
  onSuccess: () => void;
}

export function LoginForm({ onSuccess }: Props) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loginForm = LoginDataSchema.safeParse(form);
  type LoginData = z.infer<typeof LoginDataSchema>;

  const { login } = useAuth();

  function errorFor(field: keyof LoginData): string | null {
    if (!touched[field]) return null;
    if (loginForm.success) return null;

    const issue = loginForm.error.issues.find((i) => i.path[0] === field);
    return issue?.message ?? null;
  }

  async function handleSubmit(e: SyntheticEvent<HTMLFormElement, SubmitEvent>) {
    e.preventDefault();
    if (!loginForm.success) {
      setTouched({ email: true, password: true });
      return;
    }
    setSubmitting(true);
    setError(null);

    try {
      await login(form.email, form.password);
      onSuccess();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else setError("Нет соединения");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Email</span>
        <input
          type="email"
          className={`${styles.input} ${errorFor("email") ? styles.inputError : ""}`}
          placeholder="you@mail.ru"
          value={form.email}
          onChange={(e) => {
            setForm({ ...form, email: e.target.value });
            setTouched({ ...touched, email: false });
          }}
          onBlur={() => setTouched({ ...touched, email: true })}
        />
        {errorFor("email") && (
          <span className={styles.fieldError}>{errorFor("email")}</span>
        )}
      </label>
      <label className={styles.field}>
        <span className={styles.fieldLabel}>Пароль</span>
        <input
          type="password"
          className={`${styles.input} ${errorFor("password") ? styles.inputError : ""}`}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          onBlur={() => setTouched({ ...touched, password: true })}
        />
        {errorFor("password") && (
          <span className={styles.fieldError}>{errorFor("password")}</span>
        )}
      </label>

      {error && (
        <p className={styles.formError} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? "Входим…" : "Войти"}
      </button>
    </form>
  );
}

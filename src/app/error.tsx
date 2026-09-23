"use client";

import { useEffect } from "react";
import { StateCard, StateButton, StateLink } from "./_components/StateCard/StateCard";
import styles from "./error.module.scss";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className={styles.page}>
      <StateCard
        code="Transport / 503"
        tone="danger"
        icon={<AlertIcon />}
        title="Каталог временно недоступен"
        text="Сервис не ответил. Корзина и URL-параметры не изменены."
        actions={
          <>
            <StateButton variant="dangerBtn" onClick={() => reset()}>
              <RefreshIcon /> Повторить
            </StateButton>
            <StateLink variant="ghost" href="/">
              На главную
            </StateLink>
          </>
        }
      />
    </main>
  );
}

function AlertIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M12 9v5M12 17.5v.01" />
      <path d="M10.3 3.9L2.4 17.6a2 2 0 001.7 3h15.8a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
    </svg>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M21 12a9 9 0 11-3-6.7M21 4v5h-5" />
    </svg>
  );
}
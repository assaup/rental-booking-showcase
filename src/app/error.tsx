"use client";

import { useEffect } from "react";

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
    <main>
      <h1>Не удалось загрузить каталог</h1>
      <p>Похоже, сервис временно недоступен. Попробуйте ещё раз.</p>
      <button onClick={() => reset()}>Повторить</button>
    </main>
  );
}

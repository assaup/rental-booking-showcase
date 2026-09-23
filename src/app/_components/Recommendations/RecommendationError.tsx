"use client";

import { useRouter } from "next/navigation";
import { StateCard, StateButton } from "../StateCard/StateCard";

export function RecommendationsError() {
  const router = useRouter();

  return (
    <StateCard
      code="Recommendations / Partial"
      tone="info"
      icon={<EyeOffIcon />}
      title="Дополнительный блок не загрузился"
      text="Основное содержимое и бронирование работают без ограничений."
      actions={
        <StateButton variant="ghost" onClick={() => router.refresh()}>
          Повторить только рекомендации →
        </StateButton>
      }
    />
  );
}

function EyeOffIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M3 3l18 18" />
      <path d="M10.6 5.1A10.9 10.9 0 0112 5c5 0 9 4.5 10 7a14 14 0 01-3 4M6.6 6.6A14 14 0 002 12c1 2.5 5 7 10 7a10.8 10.8 0 004.5-1" />
      <path d="M9.9 9.9a3 3 0 004.2 4.2" />
    </svg>
  );
}
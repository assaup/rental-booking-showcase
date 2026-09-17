"use client";

import { useRouter } from "next/navigation";
import styles from "./Recommendations.module.scss";

export function RecommendationsError() {
  const router = useRouter();

  return (
    <div className={styles.error}>
      <div className={styles.errorIcon}>⚊</div>

      <div className={styles.errorText}>
        <p className={styles.errorTitle}>Рекомендации временно недоступны</p>
        <p className={styles.errorHint}>
          Карточка товара работает — дополнительный блок можно загрузить позже.
        </p>
      </div>

      <button
        type="button"
        className={styles.retry}
        onClick={() => router.refresh()}
      >
        ↻ Повторить
      </button>
    </div>
  );
}
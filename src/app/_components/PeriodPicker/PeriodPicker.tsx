"use client";

import { useCart } from "@/app/shared/cart/CartProvider";
import { validateDates } from "@/app/shared/cart/model";
import styles from "./PeriodPicker.module.scss";

interface Props {
  variant?: "panel" | "compact";
  hint?: string;
}

export function PeriodPicker({ variant = "panel", hint }: Props) {
  const { state, totals, dispatch } = useCart();

  const today = new Date().toISOString().slice(0, 10);
  const dateError = validateDates(state.from, state.to);
  const chosen = state.from && state.to;

  function setFrom(value: string) {
    dispatch({ type: "setDates", from: value || null, to: state.to });
  }

  function setTo(value: string) {
    dispatch({ type: "setDates", from: state.from, to: value || null });
  }

  return (
    <section className={`${styles.root} ${styles[variant]}`}>
      <div className={styles.summary}>
        <p className={styles.label}>Период аренды</p>
        <p className={styles.value}>
          {chosen ? `${formatDate(state.from!)} — ${formatDate(state.to!)}` : "Не выбран"}
          {chosen && totals.days > 0 && (
            <span className={styles.days}> · {totals.days} дн.</span>
          )}
        </p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>

      <div className={styles.inputs}>
        <input
          type="date"
          className={styles.input}
          aria-label="Дата выдачи"
          min={today}
          max={state.to ?? undefined}
          value={state.from ?? ""}
          onChange={(e) => setFrom(e.target.value)}
        />
        <span className={styles.dash}>—</span>
        <input
          type="date"
          className={styles.input}
          aria-label="Дата возврата"
          min={state.from ?? today}
          value={state.to ?? ""}
          onChange={(e) => setTo(e.target.value)}
        />
      </div>

      {dateError && <p className={styles.error}>{dateError.message}</p>}
    </section>
  );
}

function formatDate(iso: string): string {
  const [, month, day] = iso.split("-");
  const months = [
    "янв", "фев", "мар", "апр", "мая", "июн",
    "июл", "авг", "сен", "окт", "ноя", "дек",
  ];
  return `${Number(day)} ${months[Number(month) - 1]}`;
}
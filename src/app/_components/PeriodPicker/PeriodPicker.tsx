"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/shared/cart/CartProvider";
import { validateDates } from "@/shared/cart/model";
import { useMounted } from "@/shared/hooks/useMounted";
import styles from "./PeriodPicker.module.scss";

interface Props {
  /** panel — широкая плашка (корзина, каталог), compact — кнопка в шапке */
  variant?: "panel" | "compact";
  hint?: string;
}

export function PeriodPicker({ variant = "panel", hint }: Props) {
  const { state, totals, dispatch } = useCart();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const mounted = useMounted();

  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const today = new Date().toISOString().slice(0, 10);
  const dateError = validateDates(state.from, state.to);
  const chosen = Boolean(state.from && state.to);

  // закрытие по клику мимо и по Escape
  useEffect(() => {
    if (!open) return;

    function handlePointerDown(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  function updateDates(from: string | null, to: string | null) {
    dispatch({ type: "setDates", from, to });

    const syncUrl = pathname === "/" || pathname.startsWith("/equipment/");
    if (!syncUrl) return;

    const params = new URLSearchParams(searchParams.toString());

    if (from) params.set("from", from);
    else params.delete("from");

    if (to) params.set("to", to);
    else params.delete("to");

    params.delete("page");

    router.push(`${pathname}?${params}`);
  }

  const inputs = (
    <div className={styles.inputs}>
      <input
        type="date"
        className={styles.input}
        aria-label="Дата выдачи"
        min={today}
        max={state.to ?? undefined}
        value={state.from ?? ""}
        onChange={(e) => updateDates(e.target.value || null, state.to)}
      />
      <span className={styles.dash}>—</span>
      <input
        type="date"
        className={styles.input}
        aria-label="Дата возврата"
        min={state.from ?? today}
        value={state.to ?? ""}
        onChange={(e) => updateDates(state.from, e.target.value || null)}
      />
    </div>
  );

  /* ---------- компактный вариант: кнопка + всплывашка ---------- */

  if (variant === "compact") {
    const label =
      mounted && chosen ? formatRange(state.from!, state.to!) : "Выбрать даты";

    return (
      <div ref={rootRef} className={styles.compact}>
        <button
          type="button"
          className={styles.trigger}
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          aria-haspopup="dialog"
        >
          <CalendarIcon />
          <span>{label}</span>
        </button>

        {open && (
          <div
            className={styles.popover}
            role="dialog"
            aria-label="Период аренды"
          >
            <p className={styles.label}>Период аренды</p>

            {inputs}

            {mounted && chosen && totals.days > 0 && (
              <p className={styles.popoverDays}>{totals.days} дн. аренды</p>
            )}

            {(state.from || state.to) && dateError && (
              <p className={styles.error}>{dateError.message}</p>
            )}

            <button
              type="button"
              className={styles.done}
              onClick={() => setOpen(false)}
            >
              Готово
            </button>
          </div>
        )}
      </div>
    );
  }

  /* ---------- широкая плашка ---------- */

  return (
    <section className={styles.panel}>
      <div className={styles.summary}>
        <p className={styles.label}>Период аренды</p>
        <p className={styles.value}>
          {mounted && chosen
            ? formatRange(state.from!, state.to!)
            : "Не выбран"}
          {mounted && chosen && totals.days > 0 && (
            <span className={styles.days}> · {totals.days} дн.</span>
          )}
        </p>
        {hint && <p className={styles.hint}>{hint}</p>}
      </div>

      {inputs}

      {dateError && <p className={styles.error}>{dateError.message}</p>}
    </section>
  );
}

/* ---------- помощники ---------- */

const MONTHS = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

const MONTHS_SHORT = [
  "янв",
  "фев",
  "мар",
  "апр",
  "мая",
  "июн",
  "июл",
  "авг",
  "сен",
  "окт",
  "ноя",
  "дек",
];

/** "2026-09-14", "2026-09-17" → "14–17 сентября"; разные месяцы → "28 сен – 2 окт" */
function formatRange(from: string, to: string): string {
  const [fromYear, fromMonth, fromDay] = from.split("-").map(Number);
  const [toYear, toMonth, toDay] = to.split("-").map(Number);

  if (fromYear === toYear && fromMonth === toMonth) {
    return `${fromDay}–${toDay} ${MONTHS[fromMonth - 1]}`;
  }

  return `${fromDay} ${MONTHS_SHORT[fromMonth - 1]} – ${toDay} ${MONTHS_SHORT[toMonth - 1]}`;
}

function CalendarIcon() {
  return (
    <svg
      className={styles.icon}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18" />
      <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
    </svg>
  );
}

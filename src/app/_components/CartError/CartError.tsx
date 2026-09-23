"use client";

import { useCart } from "@/shared/cart/CartProvider";
import type { BookingError } from "@/shared/api/booking";
import { StateCard, StateButton, StateLink } from "../StateCard/StateCard";
import styles from "./CartError.module.scss";

interface Props {
  error: BookingError;
  onResolved: () => void;
  total: number;
}

export function CartError({ error, onResolved, total }: Props) {
  const { state, dispatch } = useCart();

  function handleRecalculate() {
    if (!error.conflicts) return;
    for (const conflict of error.conflicts) {
      dispatch({ type: "setQty", id: conflict.id, qty: conflict.available });
    }
    onResolved();
  }

  if (error.status === 409 && error.conflicts) {
    return (
      <StateCard
        code="Availability / 409"
        tone="warn"
        title="Состав заказа изменился"
        text="Остальные позиции сохранены. Пересчитайте сумму или замените товар."
        actions={
          <StateButton variant="ghost" onClick={handleRecalculate}>
            Пересчитать заказ →
          </StateButton>
        }
      >
        <ul className={styles.conflicts}>
          {error.conflicts.map((conflict) => {
            const item = state.items.find((i) => i.id === conflict.id);
            return (
              <li key={conflict.id} className={styles.conflict}>
                <span className={styles.conflictDot} />
                <span>
                  {item?.name ?? conflict.id} ·{" "}
                  {conflict.available === 0
                    ? "больше недоступна"
                    : `доступно ${conflict.available}`}
                </span>
              </li>
            );
          })}
        </ul>
      </StateCard>
    );
  }

  if (error.status === 401) {
    return (
      <StateCard
        code="Auth / 401"
        tone="info"
        title="Сессия истекла"
        text="Мы сохранили корзину. Войдите снова, чтобы продолжить оформление."
        actions={
          <StateLink variant="primary" href="/login?from=/cart">
            Войти и продолжить
          </StateLink>
        }
      />
    );
  }

  /* ---------- нет соединения ---------- */
  if (error.status === 0) {
    return (
      <StateCard
        centered
        title="Нет соединения"
        text="Корзина сохранена на этом устройстве. Проверка наличия станет доступна после подключения."
        actions={
          <StateButton variant="outline" onClick={onResolved}>
            Проверить сеть
          </StateButton>
        }
      />
    );
  }

  return (
    <StateCard
      code="Payment / Retryable"
      tone="danger"
      title="Имитация оплаты не прошла"
      text="Бронь не создана, корзина цела. Можно безопасно повторить шаг."
    >
      <div className={styles.summary}>
        <span className={styles.summaryLabel}>К оплате</span>
        <span className={styles.summaryValue}>{total} ₽</span>
      </div>
    </StateCard>
  );
}
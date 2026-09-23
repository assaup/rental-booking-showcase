"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/shared/cart/CartProvider";
import { ContactsSchema, type Contacts } from "@/app/shared/cart/model";
import {
  clearIdempotencyKey,
  getIdempotencyKey,
} from "@/app/shared/cart/idempotency";
import {
  createBooking,
  type BookingError,
  type Conflict,
} from "@/shared/api/booking";
import { ApiError } from "@/shared/api/error";
import { CartError } from "../CartError/CartError";
import styles from "./CartTotal.module.scss";
import { useAuth } from "@/app/shared/auth/AuthProvider";

interface Props {
  contacts: Contacts;
  dateValid: boolean;
  error: BookingError | null;
  onError: (error: BookingError | null) => void;
  onSuccess: (bookingNumber: string) => void;
}

export function CartTotal({
  contacts,
  dateValid,
  error,
  onError,
  onSuccess,
}: Props) {
  const { state, totals, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [simulateFailure, setSimulateFailure] = useState(false);
  const router = useRouter();
  const { clearSession } = useAuth();

  const contactsResult = ContactsSchema.safeParse(contacts);
  const canSubmit =
    contactsResult.success && dateValid && state.items.length > 0;

  async function handleSubmit() {
    if (!state.from || !state.to) return;

    setSubmitting(true);
    onError(null);

    const payload = {
      items: state.items.map((item) => ({ id: item.id, qty: item.qty })),
      from: state.from,
      to: state.to,
      extras: state.extras,
      contacts,
    };

    const key = getIdempotencyKey(state);

    try {
      const booking = await createBooking(payload, key, simulateFailure);

      onSuccess(booking.bookingNumber);
      dispatch({ type: "clear" });
      clearIdempotencyKey();
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409: {
            const data = err.data as { conflicts?: Conflict[] };
            onError({ message: err.message, conflicts: data.conflicts });
            break;
          }
          case 401:
            clearSession();
            router.push("/login?from=/cart");
            break;
          default:
            onError({ message: err.message });
        }
      } else {
        onError({
          message: "Нет соединения. Проверьте сеть и повторите действие.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Итого</h2>

      <dl className={styles.totals}>
        <div className={styles.totalsRow}>
          <dt>Аренда · {totals.days} дня</dt>
          <dd>{totals.rent} ₽</dd>
        </div>
        <div className={styles.totalsRow}>
          <dt>Возвратный залог</dt>
          <dd>{totals.deposit} ₽</dd>
        </div>
        <div className={styles.totalsRow}>
          <dt>Дополнительные услуги</dt>
          <dd>{totals.extras} ₽</dd>
        </div>
      </dl>

      <div className={styles.grand}>
        <span className={styles.grandLabel}>К оплате</span>
        <span className={styles.grandValue}>{totals.total} ₽</span>
      </div>
      <label className={styles.simulate}>
        <input
          type="checkbox"
          checked={simulateFailure}
          onChange={(e) => setSimulateFailure(e.target.checked)}
        />
        Имитировать сбой оплаты
      </label>
      <button
        type="button"
        className={styles.submit}
        onClick={() => handleSubmit()}
        disabled={!canSubmit || submitting}
      >
        {submitting ? "Отправляем…" : "Подтвердить бронирование"}
      </button>

      {error && <CartError error={error} onResolved={() => onError(null)} />}

      <p className={styles.submitHint}>
        Повторное нажатие не создаст дубликат заказа.
      </p>
    </section>
  );
}

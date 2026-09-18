"use client";
import {
  Contacts,
  ContactsSchema,
  EXTRAS,
  validateDates,
} from "../shared/cart/model";
import { categoryLabel } from "../shared/labels";
import { useState } from "react";
import Link from "next/link";
import { useCart } from "../shared/cart/CartProvider";
import { useMounted } from "../shared/hooks/useMounted";
import styles from "./page.module.scss";
import { Conflict, createBooking } from "@/shared/api/booking";
import {
  clearIdempotencyKey,
  getIdempotencyKey,
} from "../shared/cart/idempotency";
import { ApiError } from "@/shared/api/error";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const [contacts, setContacts] = useState<Contacts>({ name: "", phone: "" });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const { state, totals, dispatch } = useCart();
  const [submitting, setSubmitting] = useState(false);
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  const [error, setError] = useState<{
    message: string;
    conflicts?: Conflict[];
  } | null>(null);

  const router = useRouter();
  const mounted = useMounted();
  if (!mounted) return null;

  if (bookingNumber) {
    return (
      <main className={styles.page}>
        <div className={styles.success}>
          <div className={styles.successIcon}>✓</div>
          <h1 className={styles.successTitle}>Бронирование подтверждено</h1>
          <p className={styles.successNumber}>{bookingNumber}</p>
          <p className={styles.successText}>
            Мы сохранили заказ — он уже в истории броней. Заберите снаряжение на
            ул. Лесной, 18 и возьмите паспорт.
          </p>
          <div className={styles.successActions}>
            <Link href="/history" className={styles.successPrimary}>
              История броней
            </Link>
            <Link href="/" className={styles.successSecondary}>
              В каталог
            </Link>
          </div>
        </div>
      </main>
    );
  }
  if (state.items.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.emptyTitle}>Корзина пуста</h1>
          <p className={styles.emptyText}>
            Выберите снаряжение на нужные даты — оно появится здесь.
          </p>
          <Link href="/" className={styles.emptyLink}>
            Перейти в каталог
          </Link>
        </div>
      </main>
    );
  }

  const today = new Date().toISOString().slice(0, 10);
  const dateError = validateDates(state.from, state.to);

  const contactsResult = ContactsSchema.safeParse(contacts);

  function errorFor(field: keyof Contacts): string | null {
    if (!touched[field]) return null;
    if (contactsResult.success) return null;

    const issue = contactsResult.error.issues.find((i) => i.path[0] === field);
    return issue?.message ?? null;
  }
  const canSubmit =
    contactsResult.success && dateError === null && state.items.length > 0;

  async function handleSubmit() {
    if (!state.from || !state.to) return;
    setSubmitting(true);
    setError(null);
    const payload = {
      items: state.items.map((item) => ({ id: item.id, qty: item.qty })),
      from: state.from,
      to: state.to,
      extras: state.extras,
      contacts,
    };
    const key = getIdempotencyKey(state);
    try {
      const booking = await createBooking(payload, key);
      if (booking) {
        setBookingNumber(booking.bookingNumber);
        dispatch({ type: "clear" });
        clearIdempotencyKey();
      }
    } catch (err) {
      if (err instanceof ApiError) {
        switch (err.status) {
          case 409: {
            const data = err.data as { conflicts?: Conflict[] };
            setError({ message: err.message, conflicts: data.conflicts });
            break;
          }
          case 401:
            router.push("/login");
            break;
          default:
            setError({ message: err.message });
        }
      } else {
        setError({
          message: "Нет соединения. Проверьте сеть и повторите действие.",
        });
      }
    } finally {
      setSubmitting(false);
    }
  }

  function handleRecalculate() {
    if (!error?.conflicts) return;

    for (const conflict of error.conflicts) {
      dispatch({ type: "setQty", id: conflict.id, qty: conflict.available });
    }
    setError(null);
  }
  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Единые даты для всей корзины</p>
        <h1 className={styles.title}>Корзина и бронирование</h1>
        <p className={styles.subtitle}>
          {state.items.length} позиции · пункт на Лесной, 18
        </p>
      </header>

      <div className={styles.layout}>
        <div className={styles.main}>
          <section className={styles.period}>
            <div>
              <p className={styles.periodValue}>Период · {totals.days} дня</p>
              <p className={styles.periodHint}>
                Изменение периода пересчитает все позиции.
              </p>
            </div>

            <div className={styles.periodInputs}>
              <input
                type="date"
                className={styles.dateInput}
                min={today}
                max={state.to ?? undefined}
                value={state.from ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "setDates",
                    from: e.target.value,
                    to: state.to,
                  })
                }
              />
              <span className={styles.dateDash}>—</span>
              <input
                type="date"
                className={styles.dateInput}
                min={state.from ?? today}
                value={state.to ?? ""}
                onChange={(e) =>
                  dispatch({
                    type: "setDates",
                    from: state.from,
                    to: e.target.value,
                  })
                }
              />
            </div>
            {dateError && <p className={styles.error}>{dateError.message}</p>}
          </section>

          <ul className={styles.items}>
            {state.items.map((item) => (
              <li
                key={item.id}
                className={`${styles.item} ${
                  error?.conflicts?.some((c) => c.id === item.id)
                    ? styles.itemConflict
                    : ""
                }`}
              >
                <div className={styles.itemPhoto} />

                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>
                    {categoryLabel(item.category)}
                  </p>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>
                    {item.pricePerDay} ₽ × {totals.days} дня
                  </p>
                </div>

                <div className={styles.counter}>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() =>
                      dispatch({
                        type: "setQty",
                        id: item.id,
                        qty: item.qty - 1,
                      })
                    }
                    aria-label="Уменьшить количество"
                  >
                    −
                  </button>
                  <span className={styles.counterValue}>{item.qty}</span>
                  <button
                    type="button"
                    className={styles.counterBtn}
                    onClick={() =>
                      dispatch({
                        type: "setQty",
                        id: item.id,
                        qty: item.qty + 1,
                      })
                    }
                    aria-label="Увеличить количество"
                  >
                    +
                  </button>
                </div>

                <p className={styles.itemSum}>
                  {item.pricePerDay * item.qty * totals.days} ₽
                </p>

                <button
                  type="button"
                  className={styles.itemRemove}
                  onClick={() => dispatch({ type: "remove", id: item.id })}
                  aria-label="Удалить позицию"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>

          <section className={styles.extras}>
            <p className={styles.extrasTitle}>Дополнительно</p>
            {EXTRAS.map((extra) => (
              <label className={styles.extra} key={extra.id}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={state.extras.includes(extra.id)}
                  onChange={() =>
                    dispatch({ type: "toggleExtra", id: extra.id })
                  }
                />
                <span>
                  <span className={styles.extraName}>{extra.name}</span>
                  <span className={styles.extraHint}>{extra.price} ₽</span>
                </span>
              </label>
            ))}
          </section>
        </div>

        <aside className={styles.side}>
          <div className={styles.authNote}>Вы вошли как alexey@mail.ru</div>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Контактные данные</h2>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Имя</span>
              <input
                type="text"
                className={`${styles.input} ${errorFor("name") ? styles.inputError : ""}`}
                placeholder="Как к вам обращаться"
                value={contacts.name}
                onChange={(e) =>
                  setContacts({ ...contacts, name: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, name: true })}
              />
              {errorFor("name") && (
                <span className={styles.fieldError}>{errorFor("name")}</span>
              )}
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Телефон</span>
              <input
                type="tel"
                className={`${styles.input} ${errorFor("phone") ? styles.inputError : ""}`}
                placeholder="+7 900 000-00-00"
                value={contacts.phone}
                onChange={(e) =>
                  setContacts({ ...contacts, phone: e.target.value })
                }
                onBlur={() => setTouched({ ...touched, phone: true })}
              />
            </label>
          </section>

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

            <button
              type="button"
              className={styles.submit}
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
            >
              {submitting ? "Отправляем…" : "Подтвердить бронирование"}
            </button>
            {error && (
              <div className={styles.errorBox} role="alert">
                <p className={styles.errorTitle}>{error.message}</p>

                {error.conflicts && (
                  <>
                    <ul className={styles.conflictList}>
                      {error.conflicts.map((conflict) => {
                        const item = state.items.find(
                          (i) => i.id === conflict.id,
                        );
                        return (
                          <li key={conflict.id} className={styles.conflictItem}>
                            <span>{item?.name ?? conflict.id}</span>
                            <span className={styles.conflictQty}>
                              просите {conflict.requested}, доступно{" "}
                              {conflict.available}
                            </span>
                          </li>
                        );
                      })}
                    </ul>

                    <button type="button" className={styles.recalc} onClick={handleRecalculate}>
                      Пересчитать заказ
                    </button>
                  </>
                )}
              </div>
            )}

            <p className={styles.submitHint}>
              Повторное нажатие не создаст дубликат заказа.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

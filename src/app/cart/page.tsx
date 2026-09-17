"use client";

import Link from "next/link";
import { useCart } from "../shared/cart/CartProvider";
import { useMounted } from "../shared/hooks/useMounted";
import styles from "./page.module.scss";
import { EXTRAS, validateDates } from "../shared/cart/model";
import { categoryLabel } from "../shared/labels";

export default function CartPage() {
  const { state, totals, dispatch } = useCart();
  const mounted = useMounted();

  if (!mounted) return null;

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

  const today = new Date().toISOString().slice(0, 10)
  const dateError = validateDates(state.from, state.to);

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
        {/* ---------- левая колонка ---------- */}
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
                max={state.from ?? undefined}
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
              <li key={item.id} className={styles.item}>
                <div className={styles.itemPhoto} />

                <div className={styles.itemInfo}>
                  <p className={styles.itemCategory}>{categoryLabel(item.category)}</p>
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

          {/* доп. услуги — логику пишешь сам */}
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

        {/* ---------- правая колонка ---------- */}
        <aside className={styles.side}>
          <div className={styles.authNote}>Вы вошли как alexey@mail.ru</div>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}>Контактные данные</h2>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Имя</span>
              <input
                type="text"
                className={styles.input}
                placeholder="Как к вам обращаться"
              />
            </label>

            <label className={styles.field}>
              <span className={styles.fieldLabel}>Телефон</span>
              <input
                type="tel"
                className={styles.input}
                placeholder="+7 900 000-00-00"
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

            <button disabled={dateError !== null} type="button" className={styles.submit}>
              Подтвердить бронирование
            </button>

            <p className={styles.submitHint}>
              Повторное нажатие не создаст дубликат заказа.
            </p>
          </section>
        </aside>
      </div>
    </main>
  );
}

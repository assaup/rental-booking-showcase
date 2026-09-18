'use client'
import styles from './CartItems.module.scss'
import { type Conflict } from '@/shared/api/booking';
import { categoryLabel } from '@/app/shared/labels';
import { useCart } from '@/app/shared/cart/CartProvider';

interface Props {
    error: { message: string; conflicts?: Conflict[]} | null;
}

export function CartItems({error}: Props) {
    const { state, totals, dispatch } = useCart();
  return (
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
  );
}

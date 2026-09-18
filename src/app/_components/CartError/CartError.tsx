"use client";

import { useCart } from "@/app/shared/cart/CartProvider";
import type { BookingError } from "@/shared/api/booking";
import styles from "./CartError.module.scss";

interface Props {
  error: BookingError;
  onResolved: () => void;
}

export function CartError({ error, onResolved }: Props) {
  const { state, dispatch } = useCart();

  function handleRecalculate() {
    if (!error.conflicts) return;

    for (const conflict of error.conflicts) {
      dispatch({ type: "setQty", id: conflict.id, qty: conflict.available });
    }

    onResolved();
  }

  return (
    <div className={styles.errorBox} role="alert">
      <p className={styles.errorTitle}>{error.message}</p>

      {error.conflicts && (
        <>
          <ul className={styles.conflictList}>
            {error.conflicts.map((conflict) => {
              const item = state.items.find((i) => i.id === conflict.id);

              return (
                <li key={conflict.id} className={styles.conflictItem}>
                  <span>{item?.name ?? conflict.id}</span>
                  <span className={styles.conflictQty}>
                    просите {conflict.requested}, доступно {conflict.available}
                  </span>
                </li>
              );
            })}
          </ul>

          <button
            type="button"
            className={styles.recalc}
            onClick={handleRecalculate}
          >
            Пересчитать заказ
          </button>
        </>
      )}
    </div>
  );
}

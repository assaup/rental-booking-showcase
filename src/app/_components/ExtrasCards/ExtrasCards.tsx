"use client";
import { EXTRAS } from '@/app/shared/cart/model';
import styles from './ExtrasCards.module.scss'
import { useCart } from '@/app/shared/cart/CartProvider';


export function ExtrasCards() {
    const { state, dispatch } = useCart();
  return (
    <section className={styles.extras}>
      <p className={styles.extrasTitle}>Дополнительно</p>
      {EXTRAS.map((extra) => (
        <label className={styles.extra} key={extra.id}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={state.extras.includes(extra.id)}
            onChange={() => dispatch({ type: "toggleExtra", id: extra.id })}
          />
          <span>
            <span className={styles.extraName}>{extra.name}</span>
            <span className={styles.extraHint}>{extra.price} ₽</span>
          </span>
        </label>
      ))}
    </section>
  );
}

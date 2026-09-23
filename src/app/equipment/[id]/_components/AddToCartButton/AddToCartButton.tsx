"use client";

import { useCart } from "@/shared/cart/CartProvider";
import styles from "./AddToCartButton.module.scss";
import { Category } from "@/shared/labels";
import { useMounted } from "@/shared/hooks/useMounted";

interface Props {
  id: string;
  name: string;
  pricePerDay: number;
  deposit: number;
  category: Category;
}

export function AddToCartButton({
  id,
  name,
  pricePerDay,
  deposit,
  category,
}: Props) {
  const { state, dispatch } = useCart();
  const mounted = useMounted();

  const inCart = state.items.find((item) => item.id === id);

  function handleAdd() {
    dispatch({
      type: "add",
      item: { id, name, pricePerDay, deposit, category },
    });
  }

  if (mounted && inCart) {
    return (
      <button
        onClick={handleAdd}
        className={`${styles.button} ${styles.added}`}
      >
        <span className={styles.icon}>✓</span>В корзине · {inCart.qty} шт ·
        добавить ещё
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className={styles.button}>
      <span className={styles.icon}>🛒</span>
      Добавить в корзину
    </button>
  );
}

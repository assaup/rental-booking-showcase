"use client";

import { useCart } from "@/app/shared/cart/CartProvider";
import styles from "./AddToCartButton.module.scss";

interface Props {
  id: string;
  name: string;
  pricePerDay: number;
  deposit: number;
}

export function AddToCartButton({ id, deposit, name, pricePerDay }: Props) {
  const { dispatch } = useCart();
  function handleAdd() {
    dispatch({ type: "add", item: { id, name, pricePerDay, deposit } });
  }

  return (
    <button onClick={handleAdd} className={`${styles.button}`}>
      В корзину
    </button>
  );
}

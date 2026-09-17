"use client";

import { useCart } from "@/app/shared/cart/CartProvider";
import styles from "./AddToCartButton.module.scss";
import { Category } from "@/app/shared/labels";

interface Props {
  id: string;
  name: string;
  pricePerDay: number;
  deposit: number;
  category: Category;
}

export function AddToCartButton({ id, deposit, name, pricePerDay, category }: Props) {
  const { dispatch } = useCart();
  function handleAdd() {
    dispatch({ type: "add", item: { id, name, pricePerDay, deposit, category } });
  }

  return (
    <button onClick={handleAdd} className={`${styles.button}`}>
      В корзину
    </button>
  );
}

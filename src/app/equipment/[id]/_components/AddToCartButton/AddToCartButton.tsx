"use client";

import { useCart } from "@/shared/cart/CartProvider";
import styles from "./AddToCartButton.module.scss";
import { Category } from "@/shared/labels";
import { useMounted } from "@/shared/hooks/useMounted";
import { type EquipmentListItem } from "@/shared/api/equipment";

interface Props {
  id: string;
  name: string;
  pricePerDay: number;
  deposit: number;
  category: Category;
  item: EquipmentListItem;
}

export function AddToCartButton({
  id,
  name,
  pricePerDay,
  deposit,
  category,
  item,
}: Props) {
  const { state, dispatch } = useCart();
  const mounted = useMounted();

  const inCart = state.items.find((item) => item.id === id);
  const qtyInCart = mounted ? (inCart?.qty ?? 0) : 0;
  const canAdd = item.free > qtyInCart;

  function handleAdd() {
    if (!canAdd) return;
    dispatch({
      type: "add",
      item: { id, name, pricePerDay, deposit, category },
    });
  }

  if (qtyInCart > 0) {
    return (
      <button
        onClick={handleAdd}
        className={`${styles.button} ${styles.added}`}
        disabled={!canAdd}
      >
        <span className={styles.icon}>✓</span>В корзине · {qtyInCart} шт ·{" "}
        {canAdd ? "добавить ещё" : "больше нет"}
      </button>
    );
  }

  return (
    <button onClick={handleAdd} className={styles.button} disabled={!canAdd}>
      {canAdd ? (
        <>
          <span className={styles.icon}>🛒</span>
          Добавить в корзину
        </>
      ) : (
        "Нет в наличии на эти даты"
      )}
    </button>
  );
}

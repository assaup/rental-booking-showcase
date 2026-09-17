"use client";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useCart } from "@/app/shared/cart/CartProvider";
import { useEffect, useState } from "react";

export function Header() {
  const [mounted, setMounted] = useState();
  const { state } = useCart();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalQty = state.items.reduce((sum, item) => sum + item.qty, 0);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <span className={styles.logoMark}>▲</span>
          Северный прокат
        </Link>

        <nav className={styles.nav}>
          <Link href="/" className={styles.navLink}>
            Каталог
          </Link>
          <Link href="/terms" className={styles.navLink}>
            Условия выдачи
          </Link>
          <Link href="/history" className={styles.navLink}>
            История броней
          </Link>
        </nav>

        <div className={styles.actions}>
          <button type="button" className={styles.dates}>
            14–17 сентября
          </button>

          <Link href="/cart" className={styles.cart}>
            Корзина
            {mounted && totalQty > 0 && (
              <span className={styles.cartCount}>{totalQty}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

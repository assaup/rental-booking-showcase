"use client";
import Link from "next/link";
import styles from "./Header.module.scss";
import { useCart } from "@/shared/cart/CartProvider";
import { useMounted } from "@/shared/hooks/useMounted";
import { useAuth } from "@/shared/auth/AuthProvider";
import { PeriodPicker } from "../PeriodPicker/PeriodPicker";

export function Header() {
  const mounted = useMounted();
  const { state } = useCart();
  const { user, loading, logout } = useAuth();

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
          <PeriodPicker variant="compact" />

          <Link href="/cart" className={styles.cart}>
            Корзина
            {mounted && totalQty > 0 && (
              <span className={styles.cartCount}>{totalQty}</span>
            )}
          </Link>
          {!loading &&
            (user ? (
              <div className={styles.user}>
                <span className={styles.userName}>{user.name}</span>
                <button
                  type="button"
                  className={styles.logout}
                  onClick={logout}
                >
                  Выйти
                </button>
              </div>
            ) : (
              <Link href="/login" className={styles.login}>
                Войти
              </Link>
            ))}
        </div>
      </div>
    </header>
  );
}

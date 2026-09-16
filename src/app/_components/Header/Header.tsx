import Link from "next/link";
import styles from "./Header.module.scss";

export function Header() {
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
            <span className={styles.cartCount}>2</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
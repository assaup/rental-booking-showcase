import Link from 'next/link';
import styles from './CartEmpty.module.scss'

export function CartEmpty(){
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.emptyTitle}>Корзина пуста</h1>
          <p className={styles.emptyText}>
            Выберите снаряжение на нужные даты — оно появится здесь.
          </p>
          <Link href="/" className={styles.emptyLink}>
            Перейти в каталог
          </Link>
        </div>
      </main>
    );
}
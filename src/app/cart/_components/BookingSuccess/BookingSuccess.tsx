"use client"
import Link from "next/link";
import styles from './BookingSuccess.module.scss'

export function BookingSuccess({bookingNumber}: {bookingNumber: string}) {
  return (
    <main className={styles.page}>
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h1 className={styles.successTitle}>Бронирование подтверждено</h1>
        <p className={styles.successNumber}>{bookingNumber}</p>
        <p className={styles.successText}>
          Мы сохранили заказ — он уже в истории броней. Заберите снаряжение на
          ул. Лесной, 18 и возьмите паспорт.
        </p>
        <div className={styles.successActions}>
          <Link href="/history" className={styles.successPrimary}>
            История броней
          </Link>
          <Link href="/" className={styles.successSecondary}>
            В каталог
          </Link>
        </div>
      </div>
    </main>
  );
}

import { redirect } from "next/navigation";
import Link from "next/link";
import { categoryLabel } from "@/shared/labels";
import styles from "./page.module.scss";
import { getBookings, type Booking } from "@/shared/api/booking";
import { cookies } from "next/headers";
import { ApiError } from "@/shared/api/error";

export default async function HistoryPage() {
  const cookie = (await cookies()).toString();
  let bookings: Booking[];
  try {
    bookings = await getBookings(cookie);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      redirect("/login?from=/history");
    }
    throw err;
  }

  if (bookings.length === 0) {
    return (
      <main className={styles.page}>
        <div className={styles.empty}>
          <h1 className={styles.emptyTitle}>Броней пока нет</h1>
          <p className={styles.emptyText}>
            Выберите снаряжение на нужные даты — оформленные заказы появятся
            здесь.
          </p>
          <Link href="/" className={styles.emptyLink}>
            Перейти в каталог
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Личный кабинет</p>
        <h1 className={styles.title}>История броней</h1>
        <p className={styles.subtitle}>
          {bookings.length} заказа · пункт выдачи на Лесной, 18
        </p>
      </header>

      <ul className={styles.list}>
        {bookings.map((booking) => (
          <li key={booking.bookingNumber} className={styles.booking}>
            <div className={styles.bookingHead}>
              <div>
                <p className={styles.bookingNumber}>
                  Бронь {booking.bookingNumber}
                </p>
                <p className={styles.bookingDates}>
                  {formatDate(booking.from)} — {formatDate(booking.to)} ·{" "}
                  {booking.totals.days} дн.
                </p>
              </div>

              <span className={styles.badge}>
                <span className={styles.badgeDot} />
                Подтверждено
              </span>
            </div>

            <ul className={styles.items}>
              {booking.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <div className={styles.itemPhoto} />
                  <div className={styles.itemInfo}>
                    <p className={styles.itemCategory}>
                      {categoryLabel(item.category)}
                    </p>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>
                      {item.pricePerDay} ₽ × {booking.totals.days} дн. ×{" "}
                      {item.qty} шт.
                    </p>
                  </div>
                  <p className={styles.itemSum}>
                    {item.pricePerDay * item.qty * booking.totals.days} ₽
                  </p>
                </li>
              ))}
            </ul>

            <dl className={styles.totals}>
              <div className={styles.totalsRow}>
                <dt>Аренда</dt>
                <dd>{booking.totals.rent} ₽</dd>
              </div>
              {booking.totals.extras > 0 && (
                <div className={styles.totalsRow}>
                  <dt>Дополнительно</dt>
                  <dd>{booking.totals.extras} ₽</dd>
                </div>
              )}
              <div className={styles.totalsRow}>
                <dt>Возвратный залог</dt>
                <dd>{booking.totals.deposit} ₽</dd>
              </div>
              <div className={styles.grand}>
                <dt>Итого</dt>
                <dd>{booking.totals.total} ₽</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
    </main>
  );
}

/** "2026-09-14" → "14 сентября" */
function formatDate(iso: string): string {
  const [, month, day] = iso.split("-");
  const months = [
    "января",
    "февраля",
    "марта",
    "апреля",
    "мая",
    "июня",
    "июля",
    "августа",
    "сентября",
    "октября",
    "ноября",
    "декабря",
  ];
  return `${Number(day)} ${months[Number(month) - 1]}`;
}

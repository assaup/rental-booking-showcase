"use client";

import { useEffect, useRef, useState } from "react";
import { type Contacts, validateDates } from "@/shared/cart/model";
import { useCart } from "@/shared/cart/CartProvider";
import { useMounted } from "@/shared/hooks/useMounted";
import type { BookingError } from "@/shared/api/booking";
import { CartEmpty } from "../_components/CartEmpty/CartEmpty";
import { BookingSuccess } from "../_components/BookingSuccess/BookingSuccess";
import { ContactsForm } from "../_components/ContactsForm/ContactsForm";
import { ExtrasCards } from "../_components/ExtrasCards/ExtrasCards";
import { CartItems } from "../_components/CartItems/CartItems";
import { CartTotal } from "../_components/CartTotal/CartTotal";
import { PeriodPicker } from "../_components/PeriodPicker/PeriodPicker";
import styles from "./page.module.scss";
import { CartError } from "../_components/CartError/CartError";
import { useAuth } from "@/shared/auth/AuthProvider";
import Link from "next/link";

export default function CartPage() {
  const { state, totals } = useCart();
  const { user, loading } = useAuth();
  const mounted = useMounted();

  const [contacts, setContacts] = useState<Contacts>({ name: "", phone: "" });
  const [bookingNumber, setBookingNumber] = useState<string | null>(null);
  const [error, setError] = useState<BookingError | null>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      errorRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [error]);

  if (!mounted) return null;
  if (bookingNumber) return <BookingSuccess bookingNumber={bookingNumber} />;
  if (state.items.length === 0) return <CartEmpty />;

  const dateError = validateDates(state.from, state.to);

  return (
    <main className={styles.page}>
      <header className={styles.head}>
        <p className={styles.eyebrow}>Единые даты для всей корзины</p>
        <h1 className={styles.title}>Корзина и бронирование</h1>
        <p className={styles.subtitle}>
          {state.items.length} позиции · пункт на Лесной, 18
        </p>
      </header>
      {error && (
        <div ref={errorRef} className={styles.errorSlot}>
          <CartError
            error={error}
            onResolved={() => setError(null)}
            total={totals.total}
          />
        </div>
      )}

      <div className={styles.layout}>
        <div className={styles.main}>
          <div className={styles.period}>
            <PeriodPicker hint="Изменение периода пересчитает все позиции." />
          </div>

          <CartItems error={error} />
          <ExtrasCards />
        </div>

        <aside className={styles.side}>
          {!loading &&
            (user ? (
              <div className={styles.authNote}>Вы вошли как {user.email}</div>
            ) : (
              <div className={styles.authNoteWarn}>
                Войдите, чтобы подтвердить бронирование.{" "}
                <Link href="/login?from=/cart" className={styles.authLink}>
                  Войти
                </Link>
              </div>
            ))}

          <ContactsForm value={contacts} onChange={setContacts} />

          <CartTotal
            contacts={contacts}
            dateValid={dateError === null}
            error={error}
            onError={setError}
            onSuccess={setBookingNumber}
          />
        </aside>
      </div>
    </main>
  );
}

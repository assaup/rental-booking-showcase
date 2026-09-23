"use client";
import { useState } from "react";
import styles from "./ContactsForm.module.scss";
import { type Contacts, ContactsSchema } from "@/shared/cart/model";

interface Props {
  value: Contacts;
  onChange: (contacts: Contacts) => void;
}
export function ContactsForm({ value, onChange }: Props) {
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const contactsResult = ContactsSchema.safeParse(value);

  function errorFor(field: keyof Contacts): string | null {
    if (!touched[field]) return null;
    if (contactsResult.success) return null;

    const issue = contactsResult.error.issues.find((i) => i.path[0] === field);
    return issue?.message ?? null;
  }
  return (
    <section className={styles.card}>
      <h2 className={styles.cardTitle}>Контактные данные</h2>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Имя</span>
        <input
          type="text"
          className={`${styles.input} ${errorFor("name") ? styles.inputError : ""}`}
          placeholder="Как к вам обращаться"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
          onBlur={() => setTouched({ ...touched, name: true })}
        />
        {errorFor("name") && (
          <span className={styles.fieldError}>{errorFor("name")}</span>
        )}
      </label>

      <label className={styles.field}>
        <span className={styles.fieldLabel}>Телефон</span>
        <input
          type="tel"
          className={`${styles.input} ${errorFor("phone") ? styles.inputError : ""}`}
          placeholder="+7 900 000-00-00"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
          onBlur={() => setTouched({ ...touched, phone: true })}
        />
        {errorFor("phone") && (
          <span className={styles.fieldError}>{errorFor("phone")}</span>
        )}
      </label>
    </section>
  );
}

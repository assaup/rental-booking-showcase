import type { ReactNode } from "react";
import styles from "./StateCard.module.scss";
import Link from "next/link";

type Tone = "info" | "accent" | "warn" | "danger";

interface Props {
  /** метка сверху: "AUTH / 401", "TRANSPORT / 503" */
  code?: string;
  tone?: Tone;
  icon?: ReactNode;
  title: string;
  text?: string;
  /** дополнительный блок: список конфликтов, сумма, поле email */
  children?: ReactNode;
  /** кнопки и ссылки */
  actions?: ReactNode;
  /** центрировать содержимое (пустая выдача, офлайн) */
  centered?: boolean;
}

export function SearchIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3.5-3.5" />
    </svg>
  );
}

export function StateCard({
  code,
  tone = "info",
  icon,
  title,
  text,
  children,
  actions,
  centered = false,
}: Props) {
  return (
    <div
      className={`${styles.card} ${styles[tone]} ${centered ? styles.centered : ""}`}
      role="status"
    >
      {code && (
        <p className={styles.head}>
          {icon && <span className={styles.icon}>{icon}</span>}
          <span className={styles.code}>{code}</span>
        </p>
      )}

      {!code && icon && <span className={styles.iconRound}>{icon}</span>}

      <h2 className={styles.title}>{title}</h2>
      {text && <p className={styles.text}>{text}</p>}

      {children}

      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  );
}

export function StateButton({
  variant = "primary",
  children,
  onClick,
}: {
  variant?: "primary" | "pine" | "dangerBtn" | "outline" | "ghost";
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button type="button" className={styles[variant]} onClick={onClick}>
      {children}
    </button>
  );
}

export function StateLink({
  variant = "ghost",
  href,
  children,
}: {
  variant?: "primary" | "pine" | "outline" | "ghost";
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className={styles[variant]}>
      {children}
    </Link>
  );
}


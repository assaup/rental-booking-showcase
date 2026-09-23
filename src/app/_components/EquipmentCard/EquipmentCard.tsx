import Link from "next/link";
import styles from "./EquipmentCard.module.scss";
import { type EquipmentListItem } from "@/shared/api/equipment";
import { categoryLabel } from "@/app/shared/labels";


interface Props {
  item: EquipmentListItem;
  from?: string;
  to?: string;
}

export function EquipmentCard({ item, from, to }: Props) {

  const params = new URLSearchParams()
  if (from && to) {
    params.set('from', from)
    params.set('to', to)
  }
  const query = params.toString();
  const href = `/equipment/${item.id}${query ? `?${query}` : ""}`


  const label =
    item.free === 0
      ? "Занято на ваши даты"
      : item.free <= 2
        ? `Осталось ${item.free}`
        : "Доступно";

  const dotClass =
  item.free === 0
    ? styles.badgeDotBusy
    : item.free <= 2
      ? styles.badgeDotLow
      : "";

  return (
    <li className={styles.card}>
      <Link href={href} className={styles.link}>
        <div className={styles.photo}>
          <span className={styles.badge}>
            <span className={`${styles.badgeDot} ${dotClass}`} />
            {label}
          </span>
        </div>

        <div className={styles.body}>
          <p className={styles.category}>{categoryLabel(item.category)}</p>
          <h3 className={styles.name}>{item.name}</h3>

          <p className={styles.specs}>
            {Object.values(item.specs).join(" · ")}
          </p>

          <p className={styles.price}>{item.pricePerDay} ₽ / день</p>
          <p className={styles.deposit}>залог {item.deposit} ₽</p>
        </div>
      </Link>
      <span className={styles.arrow}>↗</span>
    </li>
  );
}

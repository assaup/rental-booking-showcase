import Link from "next/link";
import type { Equipment } from "@/server/mock/equipment";
import styles from "./EquipmentCard.module.scss";

const CATEGORY_LABELS: Record<string, string> = {
  tents: "Палатки",
  sup: "SUP-борды",
  backpacks: "Рюкзаки",
  sleeping: "Спальники",
  stoves: "Горелки",
};

export function EquipmentCard({ item }: { item: Equipment }) {
  return (
    <li className={styles.card}>
      <Link href={`/equipment/${item.id}`} className={styles.link}>
        <div className={styles.photo}>
          <span className={styles.badge}>
            {item.stock > 2 ? "Доступно" : `Осталось ${item.stock}`}
          </span>
        </div>

        <div className={styles.body}>
          <p className={styles.category}>{CATEGORY_LABELS[item.category]}</p>
          <h3 className={styles.name}>{item.name}</h3>

          <p className={styles.specs}>
            {Object.values(item.specs).join(" · ")}
          </p>

          <p className={styles.price}>{item.pricePerDay} ₽ / день</p>
          <p className={styles.deposit}>залог {item.deposit} ₽</p>
        </div>
      </Link>
      <span className={styles.badge}>
        <span
          className={`${styles.badgeDot} ${item.stock <= 2 ? styles.badgeDotLow : ""}`}
        />
        {item.stock > 2 ? "Доступно" : `Осталось ${item.stock}`}
      </span>
      <span className={styles.arrow}>↗</span>
    </li>
  );
}

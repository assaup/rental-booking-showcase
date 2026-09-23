import Link from "next/link";
import { getEquipmentList } from "@/shared/api/equipment";
import styles from "./Recommendations.module.scss";
import { categoryLabel } from "@/shared/labels";

export async function Recommendations({ excludeId }: { excludeId?: string }) {
  const query = new URLSearchParams({ sort: "price_asc", limit: "4"}); // fail: "1" в массив -> частичный сбой блока рекомендаций
  const data = await getEquipmentList(query);

  const items = data.items.filter((item) => item.id !== excludeId).slice(0, 3);

  if (items.length === 0) return null;

  return (
    <section className={styles.block}>
      <div className={styles.head}>
        <h2 className={styles.title}>Дешевле всего</h2>
        <Link href="/?sort=price_asc" className={styles.more}>
          Смотреть все →
        </Link>
      </div>

      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.id}>
            <Link href={`/equipment/${item.id}`} className={styles.card}>
              <div className={styles.photo} />
              <div>
                <p className={styles.category}>
                  {categoryLabel(item.category)}
                </p>
                <p className={styles.name}>{item.name}</p>
                <p className={styles.price}>{item.pricePerDay} ₽ / день</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RecommendationsSkeleton() {
  return (
    <div className={styles.block}>
      <div className={`${styles.skeleton} ${styles.skeletonTitle}`} />
      <div className={styles.list}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.skeletonCard}>
            <div className={`${styles.skeleton} ${styles.skeletonPhoto}`} />
            <div className={styles.skeletonLines}>
              <div className={`${styles.skeleton} ${styles.skeletonLine}`} />
              <div
                className={`${styles.skeleton} ${styles.skeletonLineShort}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

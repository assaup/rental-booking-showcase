import { notFound } from "next/navigation";
import Link from "next/link";
import { getEquipmentById } from "@/shared/api/equipment";
import { AddToCartButton } from "@/app/_components/AddToCartButton/AddToCartButton";
import { SafeBlock } from "@/app/_components/SafeBlock";
import { Recommendations } from "@/app/_components/Recommendations/Recommendations";
import styles from "./page.module.scss";
import { RecommendationsSkeleton } from "@/app/_components/Recommendations/Recommendations";
import { RecommendationsError } from "@/app/_components/Recommendations/RecommendationError";
import { categoryLabel } from "@/shared/labels";
import { PeriodPicker } from "@/app/_components/PeriodPicker/PeriodPicker";

export default async function EquipmentPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ from?: string; to?: string }>;
}) {
  const { id } = await params;
  const { from, to } = await searchParams;
  const item = await getEquipmentById(id, from, to);

  if (!item) notFound();

  const specEntries = Object.entries(item.specs).slice(0, 3);

  const hasDates = Boolean(from && to);

  const coverLabel =
    item.free === 0
      ? hasDates
        ? "Занято на ваши даты"
        : "Нет в наличии"
      : hasDates
        ? "Доступно на ваши даты"
        : "Есть в наличии";

  return (
    <main className={styles.page}>
      <nav className={styles.breadcrumbs}>
        <Link href="/" className={styles.crumbLink}>
          Каталог
        </Link>
        <span>›</span>
        <Link href={`/?category=${item.category}`} className={styles.crumbLink}>
          {categoryLabel(item.category)}
        </Link>
        <span>›</span>
        <span className={styles.crumbCurrent}>{item.name}</span>
      </nav>

      <div className={styles.layout}>
        <div className={styles.gallery}>
          <div className={styles.cover}>
            <span className={styles.badge}>
              <span
                className={`${styles.badgeDot} ${item.free === 0 ? styles.badgeDotBusy : ""}`}
              />
              {coverLabel}
            </span>
          </div>

          <div className={styles.thumbs}>
            {item.images.map((src, index) => (
              <div
                key={src}
                className={`${styles.thumb} ${index === 0 ? styles.thumbActive : ""}`}
              />
            ))}
          </div>
        </div>

        <div className={styles.info}>
          <p className={styles.category}>{categoryLabel(item.category)}</p>
          <h1 className={styles.title}>{item.name}</h1>

          <p className={styles.description}>
            {Object.values(item.specs).join(" · ")}
          </p>

          <div className={styles.specs}>
            {specEntries.map(([key, value]) => (
              <div key={key} className={styles.spec}>
                <p className={styles.specValue}>{value}</p>
                <p className={styles.specLabel}>{key}</p>
              </div>
            ))}
          </div>

          <section className={styles.booking}>
            <div className={styles.priceRow}>
              <div>
                <p className={styles.price}>{item.pricePerDay} ₽ / день</p>
                <p className={styles.depositNote}>Залог {item.deposit} ₽</p>
              </div>

              <span className={styles.stockBadge}>
                <span className={styles.badgeDot} />
                {item.free > 0 ? "В наличии" : "Нет"}
              </span>
            </div>
            <div className={styles.periodBox}>
              <PeriodPicker />
            </div>

            <AddToCartButton
              id={item.id}
              name={item.name}
              pricePerDay={item.pricePerDay}
              deposit={item.deposit}
              category={item.category}
            />
          </section>

          <div className={styles.pickup}>
            Выдача: ул. Лесная, 18. Возьмите паспорт; примерка на месте.
          </div>

          <section className={styles.rules}>
            <p className={styles.rulesTitle}>Правила выдачи</p>
            <ul className={styles.rulesList}>
              {item.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </section>
        </div>
      </div>

      <div className={styles.recommendations}>
        <SafeBlock
          loading={<RecommendationsSkeleton />}
          fallback={<RecommendationsError />}
        >
          <Recommendations excludeId={item.id} />
        </SafeBlock>
      </div>
    </main>
  );
}

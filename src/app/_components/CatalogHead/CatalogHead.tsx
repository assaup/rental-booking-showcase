"use client";
import styles from "./CatalogHead.module.scss";
import { useCatalogParams } from "@/shared/hooks/useCatalogParams";

const CATEGORY_LABELS: Record<string, string> = {
  tents: "Палатки",
  sup: "SUP-борды",
  backpacks: "Рюкзаки",
  sleeping: "Спальники",
  stoves: "Горелки",
};
const CHIP_LABELS: Record<string, (value: string) => string> = {
  category: (v) => CATEGORY_LABELS[v] ?? v,
  priceMin: (v) => `от ${v} ₽`,
  priceMax: (v) => `до ${v} ₽`,
  available: () => "Только доступное",
};

export default function CatalogHead({ total }: { total: number }) {
  const { isPending, setParam, searchParams } = useCatalogParams();

  const chips = Object.entries(CHIP_LABELS)
    .map(([key, format]) => {
      const value = searchParams.get(key);
      return value ? { key, label: format(value) } : null;
    })
    .filter((chip) => chip !== null);

  return (
    <div className={isPending ? styles.pending : ""}>
      <div className={styles.head}>
        <div>
          <h2 className={styles.title}>Доступно {total} позиции</h2>
          <p className={styles.hint}>Наличие обновлено только что</p>
        </div>

        <div className={styles.sortWrap}>
          <p className={styles.sortLabel}>Сортировка</p>
          <select
            className={styles.sort}
            value={searchParams.get("sort") ?? ""}
            onChange={(e) => setParam("sort", e.target.value)}
          >
            <option value="">По умолчанию</option>
            <option value="name_asc">По названию</option>
            <option value="price_asc">Сначала дешёвые</option>
            <option value="price_desc">Сначала дорогие</option>
          </select>
        </div>
      </div>

      {chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              className={styles.chip}
              onClick={() => setParam(chip.key, "")}
            >
              {chip.label}
              <span className={styles.chipRemove}>✕</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

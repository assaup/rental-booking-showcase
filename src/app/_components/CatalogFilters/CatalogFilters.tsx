"use client";
import { CATEGORIES } from "@/shared/labels";
import styles from "./CatalogFilters.module.scss";
import { useCatalogParams } from "@/shared/hooks/useCatalogParams";

export function CatalogFilters() {
  const { isPending, setParam, searchParams, reset } = useCatalogParams();

  return (
    <div className={`${styles.panel} ${isPending ? styles.pending : ""}`}>
      <div className={styles.head}>
        <p className={styles.heading}>Фильтры</p>
        <button type="button" className={styles.reset} onClick={reset}>
          Сбросить
        </button>
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>Категория</p>
        {CATEGORIES.map((c) => (
          <label key={c.value} className={styles.option}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={searchParams.get("category") === c.value}
              onChange={(e) =>
                setParam("category", e.target.checked ? c.value : "")
              }
            />
            {c.label}
          </label>
        ))}
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>Наличие</p>
        <label className={styles.option}>
          <input
            type="checkbox"
            className={styles.checkbox}
            checked={searchParams.get("available") === "true"}
            onChange={(e) =>
              setParam("available", e.target.checked ? "true" : "")
            }
          />
          Только доступное
        </label>
      </div>

      <div className={styles.group}>
        <p className={styles.groupTitle}>Цена за день</p>
        <div className={styles.prices}>
          <input
            type="number"
            key={`priceMin-${searchParams.get("priceMin") ?? ""}`}
            className={styles.priceInput}
            placeholder="от 300 ₽"
            defaultValue={searchParams.get("priceMin") ?? ""}
            onBlur={(e) => setParam("priceMin", e.target.value)}
          />
          <input
            type="number"
            key={`priceMax-${searchParams.get("priceMax") ?? ""}`}
            className={styles.priceInput}
            placeholder="до 2 500 ₽"
            defaultValue={searchParams.get("priceMax") ?? ""}
            onBlur={(e) => setParam("priceMax", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}

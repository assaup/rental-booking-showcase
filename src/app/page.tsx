import { getEquipmentList } from "@/shared/api/equipment";
import {
  buildQuery,
  parseCatalogParams,
  type RawSearchParams,
} from "@/shared/api/params";
import { CatalogFilters } from "./_components/CatalogFilters/CatalogFilters";
import { CatalogPagination } from "./_components/CatalogPagination/CatalogPagination";
import { EquipmentCard } from "./_components/EquipmentCard/EquipmentCard";
import styles from "./page.module.scss";
import CatalogHead from "./_components/CatalogHead/CatalogHead";
import { PeriodPicker } from "./_components/PeriodPicker/PeriodPicker";
import { CatalogDatesSync } from "./_components/CatalogDatesSync/CatalogDatesSync";
import { SearchIcon, StateCard, StateLink } from "./_components/StateCard/StateCard";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const { params, notices } = parseCatalogParams(await searchParams);
  const query = buildQuery(params);
  const data = await getEquipmentList(query);
  const items = data.items;

  return (
    <main className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.leftPart}>
          <h1 className={styles.header}>Снаряжение на ваши даты</h1>
          <p>
            Проверяйте наличие сразу на весь маршрут - цена, залоги и правила
            видны до бронирования
          </p>
        </div>
        <div className={styles.rightPart}>
          <CatalogDatesSync />
          <PeriodPicker hint="Наличие и цена считаются на этот период." />
        </div>
      </div>
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <CatalogFilters />
        </aside>
        <div>
          <CatalogHead total={data.total} />
          {notices.length > 0 && (
            <div role="status">
              <p>Некоторые параметры ссылки были исправлены:</p>
              <ul>
                {notices.map((notice) => (
                  <li key={notice}>{notice}</li>
                ))}
              </ul>
            </div>
          )}
          {items.length === 0 ? (
            <StateCard
              centered
              icon={<SearchIcon />}
              title="Ничего не найдено"
              text="На эти даты нет подходящих позиций. Снимите один фильтр или измените период."
              actions={
                <StateLink variant="primary" href="/">
                  Сбросить фильтры
                </StateLink>
              }
            />
          ) : (
            <ul className={styles.grid}>
              {items.map((item) => (
                <EquipmentCard
                  key={item.id}
                  item={item}
                  from={params.from}
                  to={params.to}
                />
              ))}
            </ul>
          )}
          <CatalogPagination
            page={data.page}
            totalPages={data.totalPages}
            query={query}
          />
        </div>
      </div>
    </main>
  );
}

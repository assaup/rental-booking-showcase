import { getEquipmentList } from "@/shared/api/equipment";
import {
  buildQuery,
  parseCatalogParams,
  type RawSearchParams,
} from "@/shared/api/params";
import { CatalogFilters } from "./_components/CatalogFilters";
import { CatalogPagination } from "./_components/CatalogPagination";
import Link from "next/link";
import { Recommendations } from "./_components/Recommendations";
import { SafeBlock } from "./_components/SafeBlock";
import { EquipmentCard } from "./_components/EquipmentCard/EquipmentCard";
import styles from "./page.module.scss";

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
    <main className={styles.layout}>
      <aside className={styles.sidebar}>
        <CatalogFilters />
      </aside>
      <div>
        <h1>Доступно {data.total} позиции</h1>
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
          <div>
            <p>По вашим фильтрам ничего не нашлось</p>
            <Link href="/">Сбросить фильтры</Link>
          </div>
        ) : (
          <ul className={styles.grid}>
            {items.map((item) => (
              <EquipmentCard key={item.id} item={item} />
            ))}
          </ul>
        )}
        <SafeBlock
          loading={<p>Загружаем рекомендации…</p>}
          fallback={<p>Рекомендации временно недоступны</p>}
        >
          <Recommendations />
        </SafeBlock>
        <CatalogPagination
          page={data.page}
          totalPages={data.totalPages}
          query={query}
        />
      </div>
    </main>
  );
}

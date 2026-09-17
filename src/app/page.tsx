import { getEquipmentList } from "@/shared/api/equipment";
import {
  buildQuery,
  parseCatalogParams,
  type RawSearchParams,
} from "@/shared/api/params";
import { CatalogFilters } from "./_components/CatalogFilters/CatalogFilters";
import { CatalogPagination } from "./_components/CatalogPagination/CatalogPagination";
import Link from "next/link";
import { Recommendations } from "./_components/Recommendations/Recommendations";
import { SafeBlock } from "./_components/SafeBlock";
import { EquipmentCard } from "./_components/EquipmentCard/EquipmentCard";
import styles from "./page.module.scss";
import CatalogHead from "./_components/CatalogHead/CatalogHead";

export default async function Home({ searchParams }: { searchParams: Promise<RawSearchParams> }) {

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
          <div className={styles.rent}>
            <h2>Период аренды</h2>
            <p>14 сен, 10:00 - 17 сен, 18:00</p>
          </div>
        </div>
      </div>
      <div className={styles.layout}>
      
      <aside className={styles.sidebar}>
        <CatalogFilters />
      </aside>
      <div>
        <CatalogHead total={data.total}/>
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

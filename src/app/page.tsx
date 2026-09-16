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
    <main>
      <h1>Витрина проката</h1>
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
      <CatalogFilters />
      <p>Всего позиций: {data.total}</p>

      {items.length === 0 ? (
        <div>
          <p>По вашим фильтрам ничего не нашлось</p>
          <Link href="/">Сбросить фильтры</Link>
        </div>
      ) : (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <h2>{item.name}</h2>
              <Link href={`/equipment/${item.id}`}>{item.name}</Link>

              <p>{item.pricePerDay} ₽ / день</p>
              <p>Залог: {item.deposit} ₽</p>
            </li>
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
    </main>
  );
}

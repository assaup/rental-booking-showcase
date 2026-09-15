import { getEquipmentList} from "@/shared/api/equipment"
import { buildCatalogQuery, type RawSearchParams } from "@/shared/api/params"
import { CatalogFilters } from "./_components/CatalogFilters"
import { CatalogPagination } from "./_components/CatalogPagination"


export default async function Home({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>
}) {
  const query = buildCatalogQuery(await searchParams)
  const data = await getEquipmentList(query)
  const items = data.items

  return (
    <main>
      <h1>Витрина проката</h1>
      <CatalogFilters />
      <p>Всего позиций: {data.total}</p>

<CatalogPagination
  page={data.page}
  totalPages={data.totalPages}
  query={query}
/>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            <h2>{item.name}</h2>
            <p>{item.pricePerDay} ₽ / день</p>
            <p>Залог: {item.deposit} ₽</p>
          </li>
        ))}
      </ul>

    </main>
  )
}
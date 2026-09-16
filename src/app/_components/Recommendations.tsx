import { getEquipmentList } from "@/shared/api/equipment";

export async function Recommendations() {
  const query = new URLSearchParams({ sort: "price_asc", limit: "3"});
  const data = await getEquipmentList(query);

  return (
    <aside>
      <h2>Дешевле всего</h2>
      <ul>
        {data.items.map((item) => (
          <li key={item.id}>
            {item.name} — {item.pricePerDay} ₽
          </li>
        ))}
      </ul>
    </aside>
  );
}
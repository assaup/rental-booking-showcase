import { notFound } from "next/navigation";
import { getEquipmentById } from "@/shared/api/equipment";
import Link from "next/link";

export default async function EquipmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getEquipmentById(id);

  if (!item) {
    notFound();
  }

  return (
    <main>
      <h1>{item.name}</h1>
      <div>
        {item.images.map((src) => (
          <div
            key={src}
            style={{ width: 200, height: 150, background: "#eee" }}
          >
            фото
          </div>
        ))}
      </div>

      <p>{item.pricePerDay} ₽ / день</p>
      <p>Залог: {item.deposit} ₽</p>

      <h2>Характеристики</h2>
      <ul>
        {Object.entries(item.specs).map(([key, value]) => (
          <li key={key}>
            {key} : {value}
          </li>
        ))}
      </ul>

      <h2>Правила выдачи</h2>
      <ul>
        {item.rules.map((rule) => (
          <li key={rule}>{rule}</li>
        ))}
      </ul>
      <Link href="/">Назад в каталог</Link>
    </main>
  );
}

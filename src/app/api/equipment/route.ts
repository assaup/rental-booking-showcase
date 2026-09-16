import { NextResponse } from "next/server";
import { equipment, type Equipment } from "@/server/mock/equipment";

const DEFAULT_LIMIT = 12;

/** Превращает строку из URL в число. Если мусор или пусто — вернёт fallback. */
function toNumber(value: string | null, fallback: number): number {
  const n = Number(value);
  return Number.isFinite(n) && value !== null && value !== "" ? n : fallback;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const category = searchParams.get("category");
  const priceMin = toNumber(searchParams.get("priceMin"), 0);
  const priceMax = toNumber(searchParams.get("priceMax"), Infinity);
  const onlyAvailable = searchParams.get("available") === "true";
  const sort = searchParams.get("sort") ?? "name_asc";
  const page = Math.max(1, toNumber(searchParams.get("page"), 1));
  const limit = toNumber(searchParams.get("limit"), DEFAULT_LIMIT);

  // 1. Фильтрация
  let result: Equipment[] = equipment;

  if (category) {
    result = result.filter((item) => item.category === category);
  }

  result = result.filter(
    (item) => item.pricePerDay >= priceMin && item.pricePerDay <= priceMax
  )

  if (onlyAvailable){
    result = result.filter((item) => item.stock > 0)
  }
  // 2. Сортировка
  switch(sort) {
            case 'price_asc':
                result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay)
                break
            case 'price_desc':
                result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay)
                break
            case 'name_asc':
                result = [...result].sort((a, b) => a.name.localeCompare(b.name))
                break
            
        }

  // 3. Пагинация
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit
  result = result.slice(start, start + limit)
  if (searchParams.get("fail") === "1") {
    return NextResponse.json({ message: "Временный сбой" }, { status: 503 });
  }

  await new Promise((resolve) => setTimeout(resolve , 1500))

  return NextResponse.json({
    items: result,
    total,
    page,
    limit,
    totalPages,
  });
}
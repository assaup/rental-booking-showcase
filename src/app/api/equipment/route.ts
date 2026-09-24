import { NextResponse } from "next/server";
import { equipment, type Equipment } from "@/server/mock/equipment";
import { freeQty } from "@/server/availability";
import { parseCatalogParams } from "@/shared/api/params";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const {
    category,
    page,
    priceMin,
    priceMax,
    available,
    limit,
    sort,
    from,
    to,
    fail,
  } = parseCatalogParams(Object.fromEntries(searchParams)).params;

  // 1. Фильтрация
  let result: Equipment[] = equipment;

  if (category) {
    result = result.filter((item) => item.category === category);
  }

  result = result.filter(
    (item) =>
      item.pricePerDay >= (priceMin ?? 0) &&
      item.pricePerDay <= (priceMax ?? Infinity),
  );

  function isAvailable(item: Equipment): boolean {
    if (item.stock <= 0) return false;
    if (!from || !to) return true;
    return freeQty(item, from, to) > 0;
  }

  if (available === "true") {
    result = result.filter((item) => isAvailable(item));
  }
  // 2. Сортировка
  switch (sort) {
    case "price_asc":
      result = [...result].sort((a, b) => a.pricePerDay - b.pricePerDay);
      break;
    case "price_desc":
      result = [...result].sort((a, b) => b.pricePerDay - a.pricePerDay);
      break;
    case "name_asc":
      result = [...result].sort((a, b) => a.name.localeCompare(b.name));
      break;
  }

  // 3. Пагинация
  const total = result.length;
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  if (fail === "1") {
    return NextResponse.json({ message: "Временный сбой" }, { status: 503 });
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  result = result.slice(start, start + limit);
  const items = result.map((item) => ({
    ...item,
    free: from && to ? freeQty(item, from, to) : item.stock,
  }));

  return NextResponse.json({
    items,
    total,
    page,
    limit,
    totalPages,
  });
}

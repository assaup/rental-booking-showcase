"use client";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { CATEGORIES } from "@/server/mock/equipment";

export function CatalogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function setParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    params.delete("page");

    router.push(`${pathname}?${params}`);
  }

  return (
    <div>
      <label>
        Категория:{" "}
        <select
          value={searchParams.get("category") ?? ""}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="">Все</option>
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Сортировать:{" "}
        <select
          value={searchParams.get("sort") ?? ""}
          onChange={(e) => setParam("sort", e.target.value)}
        >
          <option value="">Все</option>
          <option value="name_asc">По имени</option>
          <option value="price_asc">По возрастанию</option>
          <option value="price_desc">По убыванию</option>
        </select>
      </label>
    <label>
    <input
        type="checkbox"
        name="available"
        checked={searchParams.get("available") === "true"}
        onChange={(e) => setParam("available", e.target.checked ? 'true' : '')}
      />
      только доступные
    </label>
      
    </div>
  );
}

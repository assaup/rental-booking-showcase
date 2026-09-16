import { z } from "zod";
export type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};
export const CatalogParamsSchema = z.object({
  category: z.enum(["tents", "sup", "backpacks", "sleeping", "stoves"]).optional(),
  sort: z.enum(["name_asc", "price_asc", "price_desc"]).default("name_asc"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(12),
  available: z.enum(["true", "false"]).optional(),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  priceMin: z.coerce.number().min(0).optional(),
  priceMax: z.coerce.number().min(0).optional(),
  fail: z.enum(["1"]).optional(), // костыль - потом убрать
});

export type CatalogParams = z.infer<typeof CatalogParamsSchema>;

export interface ParseResult {
  params: CatalogParams;
  notices: string[];
}

function messageFor(field: string): string {
  switch (field) {
    case "page":
      return "Номер страницы был некорректным — показана первая страница.";
    case "limit":
      return "Количество позиций на странице было некорректным — использовано значение по умолчанию.";
    case "sort":
      return "Способ сортировки не распознан — применена сортировка по названию.";
    case "category":
      return "Такой категории нет — показаны все позиции.";
    case "from":
      return "Дата начала аренды указана неверно — период сброшен.";
    case "to":
      return "Дата окончания аренды указана неверно — период сброшен.";
    case "available":
      return "Фильтр доступности не распознан — показаны все позиции.";
    default:
      return `Параметр «${field}» был некорректным и заменён значением по умолчанию.`;
  }
}
export function buildQuery(params: CatalogParams): URLSearchParams {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  }

  return query;
}

export function parseCatalogParams(raw: RawSearchParams): ParseResult {
  const result = CatalogParamsSchema.safeParse(raw);

  if (result.success) {
    return { params: result.data, notices: [] };
  }

  const notices: string[] = []
  const cleaned: RawSearchParams = { ...raw  }
  const seen = new Set<string>();

  for (const issue of result.error.issues){
    const field = String(issue.path[0])

    if (seen.has(field)) continue;
    seen.add(field);

    delete cleaned[field]
    notices.push(messageFor(field))
  }

  const retry = CatalogParamsSchema.parse(cleaned)

  return { params: retry, notices };
}
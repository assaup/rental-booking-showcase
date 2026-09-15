export const ALLOWED_PARAMS = [
  "from",
  "to",
  "category",
  "priceMin",
  "priceMax",
  "available",
  "sort",
  "page",
  "limit",
] as const;

export type RawSearchParams = {
  [key: string]: string | string[] | undefined;
};

export function buildCatalogQuery(params: RawSearchParams): URLSearchParams {
  const query = new URLSearchParams();

  for (const key of ALLOWED_PARAMS) {
    const value = params[key];
    if (typeof value === "string" && value.length > 0) {
      query.set(key, value);
    }
  }
  return query
}

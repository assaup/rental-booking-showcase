import Link from "next/link";

interface Props {
  page: number;
  totalPages: number;
  query: URLSearchParams;
}

export function CatalogPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  /** Собирает ссылку на страницу, сохраняя остальные фильтры. */
  function hrefFor(target: number): string {
    const params = new URLSearchParams(query.toString());
    params.set("page", String(target));
    return `/?${params}`;
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav>
      {page > 1 && <Link href={hrefFor(page - 1)}>Назад</Link>}
      {pages.map((p) => (
        <span key={p}>
          {p === page ? (
            <strong>{p}</strong>
          ) : (
            <Link href={hrefFor(p)}>{p}</Link>
          )}
        </span>
      ))}
      {page < totalPages && <Link href={hrefFor(page + 1)}>Вперед</Link>}
    </nav>
  );
}

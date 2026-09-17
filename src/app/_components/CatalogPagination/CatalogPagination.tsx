import Link from "next/link";
import styles from "./CatalogPagination.module.scss";

interface Props {
  page: number;
  totalPages: number;
  query: URLSearchParams;
}

function getVisiblePages(page: number, totalPages: number): (number | "gap")[] {
  const pages: (number | "gap")[] = [];
  const around = 1;

  for (let i = 1; i <= totalPages; i++) {
    const isEdge = i === 1 || i === totalPages;
    const isNear = Math.abs(i - page) <= around;

    if (isEdge || isNear) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== "gap") {
      pages.push("gap");
    }
  }

  return pages;
}

export function CatalogPagination({ page, totalPages, query }: Props) {
  if (totalPages <= 1) return null;

  function hrefFor(target: number): string {
    const params = new URLSearchParams(query.toString());
    params.set("page", String(target));
    return `/?${params}`;
  }

  return (
    <nav className={styles.nav} aria-label="Страницы каталога">
      {page > 1 && (
        <Link
          href={hrefFor(page - 1)}
          className={styles.arrow}
          aria-label="Предыдущая страница"
        >
          ←
        </Link>
      )}

      {getVisiblePages(page, totalPages).map((item, index) =>
        item === "gap" ? (
          <span key={`gap-${index}`} className={styles.gap}>
            …
          </span>
        ) : item === page ? (
          <span key={item} className={styles.current} aria-current="page">
            {item}
          </span>
        ) : (
          <Link key={item} href={hrefFor(item)} className={styles.link}>
            {item}
          </Link>
        ),
      )}

      {page < totalPages && (
        <Link
          href={hrefFor(page + 1)}
          className={styles.arrow}
          aria-label="Следующая страница"
        >
          →
        </Link>
      )}
    </nav>
  );
}

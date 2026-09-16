import Link from "next/link";

export default function NotFound() {
  return (
    <main>
      <h1>Страница не найдена</h1>
      <p>Возможно, позиция снята с проката или ссылка устарела.</p>
      <Link href="/">Вернуться в каталог</Link>
    </main>
  );
}
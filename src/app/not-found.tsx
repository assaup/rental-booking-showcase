import { StateCard, StateLink } from "./_components/StateCard/StateCard";
import styles from "./not-found.module.scss";

export default function NotFound() {
  return (
    <main className={styles.page}>
      <StateCard
        centered
        code="404"
        tone="accent"
        title="Снаряжение не найдено"
        text="Позицию могли снять с проката. Даты и корзина сохранены."
        actions={
          <StateLink variant="ghost" href="/">
            ← Вернуться в каталог
          </StateLink>
        }
      />
    </main>
  );
}
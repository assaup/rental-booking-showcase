import styles from "./loading.module.scss";

export default function Loading() {
  return (
    <div className={styles.wrap}>
      <p className={styles.code}>Каталог \ Загрузка</p>
      <div className={styles.title} />

      <div className={styles.grid}>
        {[0, 1, 2].map((i) => (
          <div key={i} className={styles.card}>
            <div className={styles.photo} />
            <div className={styles.line} />
            <div className={styles.lineShort} />
          </div>
        ))}
      </div>

      <p className={styles.note}>
        Первоначальная загрузка · без старых результатов
      </p>
    </div>
  );
}
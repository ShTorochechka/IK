import React from 'react'
import styles from '../../accountPage.module.css'
import Image from 'next/image'

function PunctCategorie({ category, total, count, image, delay }) {

  const categoryImage = image;

  return (
    <div
      className={`${styles.topPunct} ${styles.punctAnimated}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.logoCard}>
        <Image width={57} height={57} alt={category} src={categoryImage} />
        <h3 className={styles.textCard}>{category}</h3>
      </div>

      <div className={`${styles.infoWrapper} ${styles.centerWrapper}`}>
        <span className={styles.titleCard}>Общ. Сумма</span>
        <h3 className={styles.textCard}>{Number(total).toLocaleString('ru-RU')}</h3>
      </div>

      <div className={styles.infoWrapper}>
        <span className={styles.titleCard}>Общ. Кол-во</span>
        <h3 className={styles.textCard}>{count}</h3>
      </div>
    </div>
  );
}

export default PunctCategorie

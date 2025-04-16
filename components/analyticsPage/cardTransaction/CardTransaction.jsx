import React from 'react';
import styles from '../analyticsPage.module.css';
import Image from 'next/image';
import Loader from '../../loader/Loader';

const imageMap = {
  'Еда': '/images/Food.png',
  'Транспорт': '/images/Transport.png',
  'Здоровье': '/images/Health.png',
  'Развлечения': '/images/Entertainment.png',
  'Одежда': '/images/Clothes.png',
  'Деньги': '/images/Money.png',
  'Другое': '/images/Other.png'
};

function CardTransaction({ category, date, comment, amount, type, id, onDelete, isLoading, delay }) {
  const imageSrc = imageMap[category] || '/images/Other.png';
  const arrowDirection = type === 'expense' ? '🠗' : '🠕';
  const priceClass = type === 'expense' ? styles.expense : styles.income;
  const formattedDate = new Date(date).toLocaleDateString('ru-RU');
  const formattedAmount = Number(amount).toLocaleString('ru-RU');

  return (
    <div
      className={`${styles.cardTransactionWrapper} ${styles.punctAnimated}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={styles.logoCard}>
        <Image width={57} height={57} alt={category} src={imageSrc} />
        <h3 className={styles.textCard}>{category}</h3>
      </div>

      <div className={styles.infoWrapper}>
        <span className={styles.titleCard}>Дата</span>
        <h3 className={styles.textCard}>{formattedDate}</h3>
      </div>

      <div className={styles.infoWrapper}>
        <span className={styles.titleCard}>Комментарий</span>
        <h3 className={styles.textCard}>{comment}</h3>
      </div>

      <div className={styles.infoWrapper}>
        <span className={styles.titleCard}>Сумма</span>
        <div className={`${styles.priceWrapper} ${priceClass}`}>
          <h3 className={`${styles.textCard} ${priceClass}`}>{formattedAmount}</h3>
          <span className={`${styles.arrowTransaction} ${priceClass}`}>{arrowDirection}</span>
        </div>
      </div>

      <div className={styles.infoWrapper}>
        <button
          onClick={() => onDelete(id)}
          disabled={isLoading}
          className={isLoading ? 'alternative' : ''}
        >
          {isLoading ? <Loader size={26} /> : 'Удалить'}
        </button>
      </div>

    </div>
  );
}

export default CardTransaction;

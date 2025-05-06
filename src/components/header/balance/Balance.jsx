'use client'
import styles from './balance.module.css'

function Balance({ balance }) {
  
  if (balance === 0) {
    return null;
  }
  return (
    <div className={styles.balanceWrapper}>
      <h3 className={styles.balance}>
        Баланс: {new Intl.NumberFormat('ru-RU').format(balance)} ₽
      </h3>
    </div>
  )
}

export default Balance
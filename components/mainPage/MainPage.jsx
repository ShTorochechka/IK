import Image from 'next/image'
import React from 'react'
import styles from './mainPage.module.css'

function MainPage() {
  return (
    <div className={styles.mainPageWrapper}>
      <div className={styles.firstBlock}>
        <h1>Учет личных финансов <span className='selectionPurple'>в Удобном Сервисе</span></h1>

        <p>В нашем сервисе для управления личными финансами вы можете 
           <span className='selectionPurple'> отслеживать доходы и расходы, 
            анализировать траты по категориям и получать наглядную аналитику. </span>
          Все данные хранятся надежно, а интуитивный интерфейс делает финансовый учет простым и удобным.
        </p>
      </div>

      <div className={styles.imgBlock}><Image height={256} width={256} src={'/images/cat.gif'} alt='error' /></div>

      <div className={styles.secondBlock}>
        <h1 className='selectionPurple'>Рекомендации для эффективного<br /> управления финансами</h1>

        <p>Анализируйте свои траты – регулярно просматривайте отчеты и выявляйте, куда уходит больше всего денег.</p>

        <p>Ставьте финансовые цели – запланируйте накопления на важные покупки или подушку безопасности.</p>

        <p>Используйте категории расходов – это поможет понять, на чем можно сэкономить и какие траты наиболее важны.</p>

        <p>Контролируйте баланс – следите за разницей между доходами и расходами, чтобы всегда оставаться в плюсе.</p>

        <p>Автоматизируйте учет – добавляйте транзакции быстро, используя удобные фильтры.</p>


        <h1 className='selectionPurple'>Начните управлять своими финансами уже<br /> сегодня – ваш бюджет под контролем!</h1>
      </div>
    </div>
  )
}

export default MainPage
'use client'

import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import PunctCategorie from './punctCategorie/PunctCategorie'
import Loader from '../../loader/Loader'
import styles from '../accountPage.module.css'

const imageMap = {
  'Еда': '/images/Food.png',
  'Транспорт': '/images/Transport.png',
  'Здоровье': '/images/Health.png',
  'Развлечения': '/images/Entertainment.png',
  'Одежда': '/images/Clothes.png',
  'Деньги': '/images/Money.png',
  'Другое': '/images/Other.png'
}

function TopCategories() {
  const [categories, setCategories] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async (showLoader = false) => {
      try {
        if (showLoader) setIsLoading(true)
        setError(null)

        const token = Cookies.get('token')
        if (!token) {
          setError('Токен отсутствует. Пожалуйста, войдите в систему.')
          return
        }

        const response = await axios.get('/api/transaction/top-categories', {
          headers: { Authorization: `Bearer ${token}` },
        })
        setCategories(response.data.categories || [])
      } catch (error) {
        console.error('Ошибка при получении категорий:', error)
        setError('Ошибка при получении категорий. Попробуйте снова.')
      } finally {
        if (showLoader) setIsLoading(false)
      }
    }

    fetchCategories(true)
    const interval = setInterval(() => fetchCategories(false), 30000)

    return () => clearInterval(interval)
  }, [])



  return (
    <div className={styles.topCategoriesWrapper}>
      <h1>ТОП КАТЕГОРИИ</h1>

      {isLoading ? (
        <div className={styles.loaderWrapperLoader}>
          <Loader size={56} />
        </div>
      ) : error ? (
        <p>{error}</p>
      ) : categories.length === 0 ? (
        <p>Здесь будут Ваши популярные категории</p>
      ) : (
        <div className={styles.topList}>
          {categories.map((cat, index) => (
            <PunctCategorie
              key={cat.category}
              category={cat.category}
              total={cat.total}
              count={cat.count}
              image={imageMap[cat.category] || '/images/Other.png'}
              delay={index * 100}
            />
          ))}

        </div>
      )}
    </div>
  )
}

export default TopCategories

'use client'
import React, { useEffect, useState } from 'react'
import styles from './analyticsPage.module.css'
import Loader from '../loader/Loader'
import FilterBtn from './filterBtn/FilterBtn'
import CardTransaction from './cardTransaction/CardTransaction'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'
import { useFinance } from '../../context/FinanceContext'

function AnalyticsPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isClient, setIsClient] = useState(false)
  const [loadingTransactions, setLoadingTransactions] = useState({})
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const router = useRouter()
  const { transactions, isLoading, deleteTransaction } = useFinance()

  useEffect(() => {
    setFilteredTransactions(transactions)
  }, [transactions])
  

  const handleFilterChange = (filter) => {
    let sorted = [...transactions]

    if (filter === 'По дате') {
      sorted.sort((a, b) => new Date(b.date) - new Date(a.date))
    } else if (filter === 'По цене (от большего)') {
      sorted.sort((a, b) => b.amount - a.amount)
    } else if (filter === 'По категориям') {
      sorted.sort((a, b) => a.category.localeCompare(b.category))
    }

    setFilteredTransactions(sorted)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isClient) {
      const token = Cookies.get('token')
      if (!token) {
        router.push('/')
      } else {
        setIsAuthenticated(true)
      }
    }
  }, [isClient, router])

  const handleDelete = async (transactionId) => {
    setLoadingTransactions((prev) => ({
      ...prev,
      [transactionId]: true,
    }))

    const result = await deleteTransaction(transactionId)

    setLoadingTransactions((prev) => ({
      ...prev,
      [transactionId]: false,
    }))
  }

  if (!isAuthenticated || isLoading) {
    return (
      <div className={styles.loaderWrapper}>
        <Loader size={56} />
      </div>
    )
  }

  return (
    <div className={styles.analyticsPageWrapper}>
      <FilterBtn onFilterChange={handleFilterChange} />

      {filteredTransactions.length > 0 ? (
        <div className={styles.listAnalytics}>
          {filteredTransactions.map((transaction, index) => (
            <CardTransaction
              key={transaction.id}
              {...transaction}
              onDelete={handleDelete}
              isLoading={loadingTransactions[transaction.id] || false}
              delay={index * 100}
            />
          ))}
        </div>
      ) : (
        <div className={styles.emptyList}>
          <p>Нет транзакций для отображения.</p>
        </div>
      )}

    </div>
  )
}

export default AnalyticsPage

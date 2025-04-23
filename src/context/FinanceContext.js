'use client'
import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { useRouter } from 'next/navigation'

const FinanceContext = createContext()

export function FinanceProvider({ children }) {
  const [balance, setBalance] = useState(0)
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const fetchBalance = async () => {
    const token = Cookies.get('token')
    if (!token) return

    try {
      const response = await axios.get('/api/balance', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setBalance(response.data.balance)
    } catch (error) {
      console.error('Ошибка при получении баланса:', error)
    }
  }

  const fetchTransactions = async () => {
    const token = Cookies.get('token')
    if (!token) return

    try {
      setIsLoading(true)
      const response = await axios.get('/api/transaction/all', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setTransactions(response.data.transactions)
    } catch (error) {
      console.error('Ошибка при получении транзакций:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const addTransaction = async (transactionData) => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/')
      return
    }

    try {
      const response = await axios.post('/api/transaction/create', transactionData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 201) {
        await fetchBalance()
        await fetchTransactions()
        return { success: true, data: response.data }
      }
    } catch (error) {
      console.error('Ошибка при добавлении транзакции:', error)
      return { success: false, error }
    }
  }

  const deleteTransaction = async (transactionId) => {
    const token = Cookies.get('token')
    if (!token) {
      router.push('/login')
      return
    }

    try {
      await axios.delete(`/api/transaction/${transactionId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      await fetchBalance()
      await fetchTransactions()
      return { success: true }
    } catch (error) {
      console.error('Ошибка при удалении транзакции:', error)
      return { success: false, error }
    }
  }

  useEffect(() => {
    const token = Cookies.get('token')
    if (token) {
      fetchBalance()
      fetchTransactions()
    }
  }, [])

  return (
    <FinanceContext.Provider
      value={{
        balance,
        transactions,
        isLoading,
        fetchBalance,
        fetchTransactions,
        addTransaction,
        deleteTransaction
      }}
    >
      {children}
    </FinanceContext.Provider>
  )
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (context === undefined) {
    throw new Error('useFinance must be used within a FinanceProvider')
  }
  return context
}
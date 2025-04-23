'use client'
import React, { useState } from 'react'
import styles from '../../accountPage.module.css'
import { useFinance } from '../../../../context/FinanceContext'
import Loader from '../../../loader/Loader'

function IncomeForm({ onClose }) {
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [comment, setComment] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { addTransaction } = useFinance()

  const validateAmount = (amount) => {
    const parsedAmount = parseInt(amount.replace(/,/g, ''), 10)
    return parsedAmount > 0 && parsedAmount <= 1000000000
  }

  const validateDate = (date) => /^(\d{2})\.(\d{2})\.(\d{4})$/.test(date)

  const validateYear = (year) => {
    const currentYear = new Date().getFullYear()
    return +year >= 1900 && +year <= currentYear
  }

  const clearMessages = (setter, visibilitySetter) => {
    setTimeout(() => {
      visibilitySetter(false)
      setTimeout(() => setter(''), 500)
    }, 5000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isSubmitting) return

    const parsedAmount = parseInt(amount.replace(/,/g, ''), 10)

    if (!amount || !validateAmount(amount)) {
      setError('Введите корректную сумму (до 1 миллиарда).')
      setShowError(true)
      clearMessages(setError, setShowError)
      return
    }

    if (!date || !validateDate(date)) {
      setError('Введите корректную дату в формате ДД.ММ.ГГГГ.')
      setShowError(true)
      clearMessages(setError, setShowError)
      return
    }

    const [day, month, year] = date.split('.')

    if (!validateYear(year)) {
      setError('Введите корректный год в диапазоне от 1900 до текущего года.')
      setShowError(true)
      clearMessages(setError, setShowError)
      return
    }

    if (comment.length > 50) {
      setError('Комментарий не может быть длиннее 50 символов.')
      setShowError(true)
      clearMessages(setError, setShowError)
      return
    }

    const payload = {
      type: 'income',
      amount: parsedAmount,
      date: `${year}-${month}-${day}`,
      comment,
    }
    setIsSubmitting(true)

    const result = await addTransaction(payload)

    if (result.success) {
      setAmount('')
      setDate('')
      setComment('')
      setSuccess('Доход успешно добавлен! 🎉')
      setShowSuccess(true)
      clearMessages(setSuccess, setShowSuccess)
    } else {
      setError('Ошибка при отправке данных. Попробуйте снова.')
      setShowError(true)
      clearMessages(setError, setShowError)
    }
    setIsSubmitting(false)
  }

  const handleAmountChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, '').slice(0, 15)
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    setAmount(formatted)
  }

  const handleDateChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    let formatted = rawValue

    if (rawValue.length >= 3 && rawValue.length <= 4) {
      formatted = rawValue.slice(0, 2) + '.' + rawValue.slice(2)
    } else if (rawValue.length > 4 && rawValue.length <= 8) {
      formatted = rawValue.slice(0, 2) + '.' + rawValue.slice(2, 4) + '.' + rawValue.slice(4)
    }

    setDate(formatted)
  }

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={`${styles.titleModal} ${styles.E}`}>Добавим доход!</h1>

        <div className={styles.message}>
          <div className={`${styles.error} ${showError ? styles.show : ''}`}>
            {error}
          </div>
        </div>

        <div className={styles.message}>
          <div className={`${styles.success} ${showSuccess ? styles.show : ''}`}>
            {success}
          </div>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            required
            value={amount}
            onChange={handleAmountChange}
            className={amount ? styles.filled : ''}
          />
          <label>Сумма <span className={styles.required}>*</span></label>
        </div>

        <div className={styles.inputWrapper}>
          <input
            type="text"
            required
            value={date}
            onChange={handleDateChange}
            maxLength={10}
            className={date ? styles.filled : ''}
          />
          <label>Дата <span className={styles.required}>*</span></label>
        </div>

        <div className={styles.inputWrapper}>
          <textarea
            required
            rows="4"
            cols="50"
            maxLength="50"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={comment ? styles.filled : ''}
          />
          <label>Комментарий <span className={styles.required}>*</span></label>
        </div>

        <div className={styles.btnWrapper}>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`${isSubmitting ? 'alternative' : ''}`}
          >
            {isSubmitting ? (
              <Loader size={26} />
            ) : (
              'Создать'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default IncomeForm

'use client'
import React, { useState, useEffect, useRef } from 'react';
import styles from '../../accountPage.module.css';
import { useFinance } from '../../../../context/FinanceContext';
import Loader from '../../../loader/Loader';

function ExpenseForm() {
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [comment, setComment] = useState('');
  const [category, setCategory] = useState('Другое');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const dropdownRef = useRef(null);
  const { addTransaction } = useFinance();

  const categories = [
    { value: 'Еда', label: 'Еда' },
    { value: 'Деньги', label: 'Деньги' },
    { value: 'Транспорт', label: 'Транспорт' },
    { value: 'Здоровье', label: 'Здоровье' },
    { value: 'Другое', label: 'Другое' },
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const clearMessages = (setter, visibilitySetter) => {
    setTimeout(() => {
      visibilitySetter(false);
      setTimeout(() => setter(''), 500);
    }, 5000);
  };

  const handleCategorySelect = (value) => {
    setCategory(value);
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormSubmitted(true);

    if (!amount || !date || !comment || !category) {
      setError('Пожалуйста, заполните все поля!');
      setShowError(true);
      clearMessages(setError, setShowError);
      setFormSubmitted(false);
      return;
    }

    if (comment.length > 50) {
      setError('Комментарий не может быть длиннее 50 символов.');
      setShowError(true);
      clearMessages(setError, setShowError);
      setFormSubmitted(false);
      return;
    }

    const formattedDate = date.split('.').reverse().join('-');
    const payload = {
      type: 'expense',
      amount: parseFloat(amount.replace(/\D/g, '').replace(',', '.')),
      date: formattedDate,
      comment,
      category,
    };

    const result = await addTransaction(payload);

    if (result.success) {
      setAmount('');
      setDate('');
      setComment('');
      setCategory('Другое');
      setSuccess('Расход успешно добавлен! 🎉');
      setShowSuccess(true);
      clearMessages(setSuccess, setShowSuccess);
      setFormSubmitted(false);
    } else {
      setError('Произошла ошибка при добавлении расхода.');
      setShowError(true);
      clearMessages(setError, setShowError);
      setFormSubmitted(false);
    }
  };

  const handleAmountChange = (e) => {
    let rawValue = e.target.value.replace(/\D/g, '').slice(0, 15);
    const formatted = rawValue.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    setAmount(formatted);
  };

  const handleDateChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    let formatted = raw;

    if (raw.length >= 3 && raw.length <= 4) {
      formatted = `${raw.slice(0, 2)}.${raw.slice(2)}`;
    } else if (raw.length > 4 && raw.length <= 8) {
      formatted = `${raw.slice(0, 2)}.${raw.slice(2, 4)}.${raw.slice(4)}`;
    }

    setDate(formatted);
  };

  return (
    <div className={styles.formWrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h1 className={`${styles.titleModal} ${styles.I}`}>Добавим расход!</h1>

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

        <div className={`${styles.inputWrapper} ${category ? styles.filled : ''}`}>
          <label className={styles.label}>
            Категория <span className={styles.required}>*</span>
          </label>
          <div
            ref={dropdownRef}
            className={`${styles.dropdown} ${category ? styles.filled : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <div className={styles.dropdownSelected}>
              {category}
            </div>
            {isDropdownOpen && (
              <div className={styles.dropdownOptions}>
                {categories.map((option) => (
                  <div
                    key={option.value}
                    className={styles.dropdownOption}
                    onClick={() => handleCategorySelect(option.value)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
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
            disabled={formSubmitted}
            className={`${formSubmitted ? 'alternative' : ''}`}
          >
            {formSubmitted ? (
              <Loader size={26}/>
            ) : (
              'Создать'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ExpenseForm;
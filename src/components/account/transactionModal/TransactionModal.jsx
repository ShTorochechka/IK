'use client';
import React, { useEffect, useState } from 'react';
import styles from '../accountPage.module.css';
import IncomeForm from './incomeForm/IncomeForm';
import ExpenseForm from './expenseForm/ExpenseForm';

function TransactionModal({ type, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : ''}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.modal} ${isClosing ? styles.scaleOut : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={styles.closeBtn} onClick={handleClose}>
          &times;
        </p>
        {type === 'income' ? <IncomeForm onClose={onClose} /> : <ExpenseForm onClose={onClose} />}
      </div>
    </div>
  );
}

export default TransactionModal;

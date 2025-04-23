'use client';
import React, { useState, useEffect } from 'react';
import styles from '../accountPage.module.css';
import TransactionModal from '../transactionModal/TransactionModal';

function AddTransactionPanel() {
  const [modalType, setModalType] = useState(null);
  
  useEffect(() => {
    if (modalType) {
      document.body.classList.add('hiddenScroll');
      document.documentElement.classList.add('hiddenScroll');
    } else {
      document.body.classList.remove('hiddenScroll');
      document.documentElement.classList.remove('hiddenScroll');
    }
    return () => {
      document.body.classList.remove('hiddenScroll');
      document.documentElement.classList.remove('hiddenScroll');
    };
  }, [modalType]);

  return (
    <>
      <div className={styles.panelWrapper}>
        <button onClick={() => setModalType('income')}>Добавить доход</button>
        <button onClick={() => setModalType('expense')}>Добавить расход</button>
      </div>

      {modalType && (
        <TransactionModal
          type={modalType}
          onClose={() => setModalType(null)}
        />
      )}
    </>
  );
}

export default AddTransactionPanel;

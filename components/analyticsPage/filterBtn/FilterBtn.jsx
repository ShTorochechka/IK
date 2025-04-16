'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import styles from '../analyticsPage.module.css'

const filterOptions = [
  'По дате',
  'По цене (от большего)',
  'По категориям'
]

function FilterBtn({ onFilterChange }) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFilter, setSelectedFilter] = useState(filterOptions[0])
  const dropdownRef = useRef(null)

  const toggleDropdown = () => setIsOpen(prev => !prev)

  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
    onFilterChange(filter)
    setIsOpen(false)
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className={styles.filterBtnWrapper} ref={dropdownRef}>
      <h2>Все транзакции</h2>

      <div className={styles.filterContainer}>
        <div className={styles.filterBtn} onClick={toggleDropdown}>
          <Image height={16} width={16} alt="filter" src="/images/filterIco.png" />
          <span>{selectedFilter}</span>
          <span className={`${styles.arrow} ${isOpen ? styles.rotate : ''}`}>▼</span>
        </div>

        <div className={`${styles.dropdown} ${isOpen ? styles.open : ''}`}>
          {filterOptions.map((option) => (
            <div
              key={option}
              className={styles.dropdownItem}
              onClick={() => handleFilterClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterBtn

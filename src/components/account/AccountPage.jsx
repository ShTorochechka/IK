'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './accountPage.module.css'
import Image from 'next/image'
import AddTransactionPanel from './addTransactionPanel/AddTransactionPanel'
import TopCategories from './topCategories/TopCategories'
import axios from 'axios'
import Cookies from 'js-cookie'
import Loader from '../loader/Loader'

function Account() {
  const [imagePreview, setImagePreview] = useState(null)
  const [userName, setUserName] = useState('')
  const [isClient, setIsClient] = useState(false)  
  const [loading, setLoading] = useState(true)  
  const router = useRouter()  

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    const token = Cookies.get('token')

    if (!token) {
      router.push('/')
      return
    }

    axios.get('/api/user', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then((response) => {
        const { name, avatar } = response.data.user
        setUserName(name || 'Ноунейм')
        setImagePreview(avatar || '/images/avatar.png')
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching user data:', error)
        setUserName('Ноунейм')
        setImagePreview('/images/avatar.png')
        setLoading(false)
      })
  }, [isClient, router])

  if (!isClient || loading) {
    return <div className={styles.loaderWrapper}><Loader size={84} /></div>

  }

  return (
    <div className={styles.accountWrapper}>
      <div className={styles.upBlock}>
        <div className={styles.avatarBlock}>
          <div className={styles.avatarWrapper}>
            {imagePreview && imagePreview !== '/images/avatar.png' ? (
              <Image
                width={188}
                height={192}
                alt='User avatar'
                src={imagePreview}
                className={styles.imgAvatar}
              />
            ) : (
              <div className={styles.placeholderAvatar}>
                <Image
                  width={100}
                  height={100}
                  alt='Default avatar'
                  src='/images/avatar.png'
                  className={styles.imgPrev}
                />
              </div>
            )}
          </div>
          <h1>{userName}</h1>
        </div>

        <AddTransactionPanel />
      </div>

      <div className={styles.downBlock}>
        <TopCategories />
      </div>
    </div>
  )
}

export default Account

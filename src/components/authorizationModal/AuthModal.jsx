'use client';
import React, { useState, useEffect, useRef } from 'react';
import styles from './modal.module.css';
import LoginForm from './loginForm/LoginForm';
import RegisterForm from './registerForm/RegisterForm';
import ForgotForm from './forgotForm/ForgotForm';
import Image from 'next/image';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isForget, setIsForget] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const fileInputRef = useRef(null);
  const [avatarBase64, setAvatarBase64] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
        clearFields();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
    setAvatarBase64(null);
    setImagePreview(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setAvatarBase64(reader.result);
        const previewUrl = URL.createObjectURL(file);
        setImagePreview(previewUrl);
      };

      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleLoginSuccess = () => {
    onAuthSuccess();
  };

  const handleRegisterSuccess = () => {
    onAuthSuccess();
  };

  if (!isOpen && !isVisible) return null;

  return (
    <div
      className={`${styles.overlay} ${!isOpen ? styles.fadeOut : ''}`}
      onClick={onClose}
    >
      <div
        className={`${styles.modal} ${!isOpen ? styles.scaleOut : ''}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.closeBtn} onClick={onClose}>
          &times;
        </div>
        <div className={styles.authContainer}>
          <div className={styles.titleModal}>
            <h1>Добро пожаловать!</h1>
            <h1>
              {isForget
                ? 'Сброс пароля'
                : isRegister
                ? 'Создадим Вам аккаунт!'
                : 'Войдите в свой аккаунт'}
            </h1>
          </div>

          {isForget ? (
            <ForgotForm
              email={email}
              setEmail={setEmail}
              setIsForget={setIsForget}
            />
          ) : isRegister ? (
            <>
              <div className={styles.uploadImgWrapper}>
                {imagePreview ? (
                  <Image
                    src={imagePreview}
                    alt="Uploaded image"
                    width={185}
                    height={185}
                    className={styles.imgAvatar}
                  />
                ) : (
                  <div
                    className={styles.placeholderAvatar}
                    onClick={triggerFileUpload}
                  >
                    <Image
                      src="/images/avatar.png"
                      alt="Camera icon"
                      width={100}
                      height={100}
                      className={styles.imgPrev}
                    />
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <RegisterForm
                name={name}
                email={email}
                password={password}
                setName={setName}
                setEmail={setEmail}
                setPassword={setPassword}
                avatarBase64={avatarBase64}
                switchToLogin={() => {
                  clearFields();
                  setIsRegister(false);
                }}
                onRegisterSuccess={handleRegisterSuccess}
              />
            </>
          ) : (
            <LoginForm
              email={email}
              password={password}
              setEmail={setEmail}
              setPassword={setPassword}
              setIsForget={setIsForget}
              switchToRegister={() => {
                clearFields();
                setIsRegister(true);
              }}
              onLoginSuccess={handleLoginSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}

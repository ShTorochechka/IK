'use client';

import axios from 'axios';
import Cookies from 'js-cookie';
import styles from '../modal.module.css';
import { useEffect, useState } from 'react';
import Loader from '../../loader/Loader';

export default function LoginForm({
  email, password, setEmail, setPassword, setIsForget, switchToRegister, onLoginSuccess
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/auth/login', { email, password });
      Cookies.set('token', response.data.token, { expires: 1 });
      onLoginSuccess();
    } catch (error) {
      console.error('Ошибка при входе:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = Cookies.get('token');
    if (token) {
      onLoginSuccess();
    }
  }, []);

  return (
    <form className={styles.form} onSubmit={handleLogin}>
      <div className={styles.inputWrapper}>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={email ? styles.filled : ''}
          disabled={isLoading}
        />
        <label>Email <span className={styles.required}>*</span></label>
      </div>

      <div className={styles.inputWrapper}>
        <input
          type="password"
          required
          value={password}
          maxLength={25}
          onChange={(e) => setPassword(e.target.value)}
          className={password ? styles.filled : ''}
          disabled={isLoading}
        />
        <label>Пароль <span className={styles.required}>*</span></label>
      </div>

      <div className={styles.buttonGroup}>
        <div className={styles.logAndRegBtn}>
          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitBtn} ${isLoading ? 'alternative' : ''}`}
          >
            {isLoading ? <Loader size={26}/> : 'Войти'}
          </button>
          <button type="button" onClick={switchToRegister} disabled={isLoading} className="alternative">Регистрация</button>
        </div>
        <p className={styles.forgot} onClick={() => !isLoading && setIsForget(true)}>Забыли пароль?</p>
      </div>
    </form>
  );
}

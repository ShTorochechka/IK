'use client';

import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import React, { useState } from 'react';
import styles from './resetPasswordPage.module.css';
import Loader from '../loader/Loader';

function ResetPasswordPage() {
    const token = useSearchParams().get('token');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (!token) {
        return (
            <p className={styles.error}>
                Токен сброса пароля не был передан. Пожалуйста, убедитесь, что вы получили правильную ссылку.
            </p>
        );
    }

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (password !== confirm) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        if (password.length < 8) {
            setError('Пароль должен быть не менее 8 символов');
            setLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/reset-password', { token, password });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Ошибка сброса');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={styles.forgetFormWrapper}>
                {success && <p className="success">Пароль успешно изменён.<br />Теперь вы можете войти.</p>}
            </div>
        );
    }

    return (
        <form className={styles.forgetFormWrapper} onSubmit={handleReset}>
            <h2>Новый пароль</h2>
            {error && <p className={styles.error}>{error}</p>}

            <input
                type="password"
                placeholder="Новый пароль"
                value={password}
                maxLength={25}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            <input
                type="password"
                placeholder="Повторите пароль"
                value={confirm}
                maxLength={25}
                onChange={(e) => setConfirm(e.target.value)}
                required
            />
            <button
                type="submit"
                disabled={loading}
                className={loading ? 'alternative' : ''}
            >
                {loading ? <Loader size={26} /> : 'Сбросить пароль'}
            </button>
        </form>
    );
}

export default ResetPasswordPage;

import axios from 'axios';
import styles from '../modal.module.css';
import { useState } from 'react';
import Cookies from 'js-cookie';
import Loader from '../../loader/Loader';

export default function RegisterForm({ name, email, password, setName, setEmail, setPassword, avatarBase64, switchToLogin, onRegisterSuccess }) {
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('/api/auth/register', {
                name,
                email,
                password,
                avatar: avatarBase64,
            });

            Cookies.set('token', response.data.token, { expires: 1 });
            setIsRegisterSuccess(true);
            onRegisterSuccess();
        } catch (error) {
            console.error('Ошибка при регистрации:', error.response?.data || error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleRegister}>
            <div className={styles.inputWrapper}>
                <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={name ? styles.filled : ''}
                    maxLength={25}
                    disabled={isLoading}
                />
                <label>Имя <span className={styles.required}>*</span></label>
            </div>

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
                    onChange={(e) => setPassword(e.target.value)}
                    className={password ? styles.filled : ''}
                    maxLength={25}
                    disabled={isLoading}
                />
                <label>Пароль <span className={styles.required}>*</span></label>
            </div>

            <div className={styles.buttonGroup}>
                <div className={styles.logAndRegBtn}>
                    <button type="submit" className={isLoading ? 'alternative' : ''} disabled={isLoading}>
                        {isLoading ? <Loader size={26}/> : 'Создать'}
                    </button>
                    <button type="button" className="alternative" onClick={switchToLogin} disabled={isLoading}>Назад</button>
                </div>
            </div>
        </form>
    );
}

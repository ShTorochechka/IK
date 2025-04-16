import axios from 'axios';
import { useState } from 'react';
import styles from '../modal.module.css';
import Loader from '../../loader/Loader';

export default function ForgotForm({ email, setEmail, setIsForget }) {
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setError('');
        setIsLoading(true);

        if (!email) {
            setError('Пожалуйста, введите ваш email');
            setIsLoading(false);
            return;
        }

        try {
            await axios.post('/api/auth/reset-request', { email });
            setMessage('Ссылка для сброса пароля отправлена!');
        } catch (err) {
            setError('Не удалось отправить ссылку. Попробуйте ещё раз.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {message && <p className={styles.success}>{message}</p>}
            {error && <p className={styles.error}>{error}</p>}

            <p className={styles.memo}>Введите ваш email, и мы вышлем ссылку для сброса пароля</p>

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

            <div className={styles.buttonGroup}>
                <div className={styles.logAndRegBtn}>
                    <button type="submit" className={isLoading ? 'alternative' : styles.activeBtn} disabled={isLoading}>
                        {isLoading ? <Loader size={26}/> : 'Отправить'}
                    </button>
                    <button type="button" className="alternative" onClick={() => setIsForget(false)} disabled={isLoading}>
                        Назад
                    </button>
                </div>
            </div>
        </form>
    );
}

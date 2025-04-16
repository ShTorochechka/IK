'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../header.module.css';
import AuthModal from '../../authorizationModal/AuthModal';
import Cookies from 'js-cookie';
import Link from 'next/link';
import Balance from '../balance/Balance';
import { useFinance } from '../../../context/FinanceContext';
import Loader from '../../loader/Loader';

function MobileMenu() {
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);

    const { balance, isLoading } = useFinance();

    const isAccountPage = pathname === '/account';

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (open || isAuthOpen) {
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
    }, [open, isAuthOpen]);

    const toggleMenu = () => {
        setOpen(!open);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        router.push('/');
    };

    const menuItemsData = [
        { title: 'Главная', url: '/' },
        { title: 'Аналитика', url: '/analytics' },
        { title: 'Контакты', url: '/' },
    ];

    return (
        <>
            <div className={`${styles.blurBackground} ${open ? styles.active : ''}`} onClick={toggleMenu}></div>

            <header className={`${styles.headerWrapperMobile}`}>
                <div className={`${styles.logoNav}`}>
                    <div className={`${styles.logoNavWrapper} container`}>
                        <h1 className={styles.headerLogo}>IK</h1>
                        <div
                            className={`${styles.burgerBtn} ${open ? styles.open : ''}`}
                            onClick={toggleMenu}
                        >
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>

                <div className={`${styles.navEnterBtn} ${open ? styles.show : ''}`}>
                    <nav>
                        <ul className={styles.navList}>
                            {menuItemsData.map((menu, index) => (
                                <li key={index}>
                                    <a href={menu.url}>{menu.title}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className={styles.accountBtnAndBalance}>
                        {isLoggedIn ? (
                            <>
                                {isLoading ? (
                                    <Loader/>
                                ) : (
                                    <Balance balance={balance} />
                                )}
                                {isAccountPage ? (
                                    <button onClick={handleLogout}>Выйти</button>
                                ) : (
                                    <Link href="/account">
                                        <button>Аккаунт</button>
                                    </Link>
                                )}
                            </>
                        ) : (
                            <button onClick={() => setIsAuthOpen(true)}>Войти</button>
                        )}
                    </div>
                </div>
            </header>

            <AuthModal
                isOpen={isAuthOpen}
                onClose={() => setIsAuthOpen(false)}
                onAuthSuccess={() => {
                    setIsLoggedIn(true);
                    setIsAuthOpen(false);
                }}
            />
        </>
    );
}

export default MobileMenu;

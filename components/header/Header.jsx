'use client'
import React, { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from './header.module.css';
import Cookies from 'js-cookie';
import MobileMenu from './mobileMenu/MobileMenu.jsx';
import AuthModal from '../authorizationModal/AuthModal';
import Balance from './balance/Balance';
import { useFinance } from '../../context/FinanceContext';
import Loader from '../loader/Loader';

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const { balance, isLoading } = useFinance();

    const isAccountPage = pathname === '/account';

    const menuItemsData = [
        { title: 'Главная', url: '/' },
        { title: 'Аналитика', url: '/analytics' },
        { title: 'Контакты', url: '/' },
    ];

    useEffect(() => {
        const token = Cookies.get('token');
        if (token) {
            setIsLoggedIn(true);
        }
    }, []);

    useEffect(() => {
        if (isAuthOpen) {
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
    }, [isAuthOpen]);

    const handleAuthSuccess = () => {
        setIsLoggedIn(true);
        setIsAuthOpen(false);
    };

    const handleLogout = () => {
        Cookies.remove('token');
        setIsLoggedIn(false);
        router.push('/');
    };

    return (
        <>
            <header className={`${styles.headerWrapper} ${isLoggedIn ? styles.loggedIn : ''} PC container`}>
                <h1 className={styles.headerLogo}>IK</h1>

                <nav>
                    <ul className={styles.navList}>
                        {menuItemsData.map((menu, index) => (
                            <li key={index}>
                                <Link href={menu.url} legacyBehavior>
                                    <a className={pathname === menu.url ? styles.activeLink : ''}>
                                        {menu.title}
                                    </a>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className={styles.accountBtnAndBalance}>
                    {isLoggedIn ? (
                        <>
                            {isLoading ? (
                                <Loader size={26}/>
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
            </header>

            <MobileMenu />

            <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={handleAuthSuccess} />
        </>
    );
}

export default Header;

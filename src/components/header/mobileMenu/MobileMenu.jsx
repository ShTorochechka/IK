'use client';
import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import styles from '../header.module.css';
import Link from 'next/link';
import Balance from '../balance/Balance';
import Loader from '../../loader/Loader';

function MobileMenu({
    isLoggedIn,
    isAuthOpen,
    setIsAuthOpen,
    handleLogout,
    balance,
    isLoading,
}) {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isAccountPage = pathname === '/account';

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

    const menuItemsData = [
        { title: 'Главная', url: '/' },
        { title: 'Аналитика', url: '/analytics' },
        { title: 'Новости', url: '/news' },
    ];

    return (
        <>
            <div className={`${styles.blurBackground} ${open ? styles.active : ''}`} onClick={toggleMenu}></div>

            <header className={`${styles.headerWrapperMobile}`}>
                <div className={`${styles.logoNav}`}>
                    <div className={`${styles.logoNavWrapper} container`}>
                        <h1 className={styles.headerLogo}>IK</h1>
                        <div className={`${styles.burgerBtn} ${open ? styles.open : ''}`} onClick={toggleMenu}>
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
                                    <Loader size={26} />
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
        </>
    );
}

export default MobileMenu;

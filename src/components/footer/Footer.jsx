import Image from 'next/image';
import styles from './footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <div className='container'>
        <div className={styles.logoInfo}>
          <div className={styles.logo}>
            <h1>IK</h1>
          </div>

          <nav className={styles.socialMobile}>
            <a href="https://github.com/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=RHLuYrY4GjUv&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>

            <a href="https://t.me/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=CYghN6YMk6Za&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>

            <a href="https://vk.com/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=w2mBMjvoILwt&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>
          </nav>

          <nav className={styles.info}>
            <a href="/">О нас</a>
            <a href="/">Новости</a>
            <a href="/">Контакты</a>
          </nav>
        </div>

        <div className={styles.line}></div>

        <div className={styles.copSoc}>
          <p>© 2025 EATLY All Rights Reserved.</p>
          <nav className={styles.socialPC}>
            <a href="https://github.com/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=RHLuYrY4GjUv&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>

            <a href="https://t.me/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=CYghN6YMk6Za&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>

            <a href="https://vk.com/">
              <Image
                width={34}
                height={34}
                src='https://img.icons8.com/?size=100&id=w2mBMjvoILwt&format=png&color=B908FF'
                alt='s'
                unoptimized
              />
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import React from 'react'
import styles from './loader.module.css'
const Loader = ({size}) => {
    return (
        <div className={styles.loaderWrapper}>
            <div className={styles.loader} style={{width: size, height: size}}></div>
        </div>
    )
}

export default Loader
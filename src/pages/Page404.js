import React from 'react';

import styles from "../static/css/page404.module.css"
import NavBar from '../components/NavBar';

const Page404 = () => {
    return (
        <>
            <NavBar />
            <div className={styles.container}>
                <p className={styles.text}>404</p>
            </div>
        </>
    );
}

export default Page404;

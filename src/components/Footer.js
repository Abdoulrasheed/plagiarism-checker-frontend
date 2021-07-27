import React from 'react';
import { withRouter } from 'react-router-dom';
import { routes } from '../pages/routes';

import styles from "../static/css/footer.module.css"
import logo from "../static/images/logo.svg"

const Footer = withRouter(({history}) => {
    return (
        <div className={styles.container}>
            <div className={styles.scanNowContainer}>
                <div className={styles.detail}>
                    <h2 className={styles.subtitle}>Scan your document.</h2>
                    <h1 className={styles.title}>Write that unique idea.</h1>
                    <h3 className={styles.motivation}>Improve your writing skills.</h3>
                    <h3 className={styles.author}>Become a better author.</h3>
                </div>
                <button className={styles.scanButton} onClick={()=>history.push(routes.mainPage)}>Scan Now</button>
            </div>

            <div className={styles.footer}>
                <div className={styles.footerI}>
                    <img src={logo} className={styles.logo} alt="logo" />
                    <a href="https://abdull.dev/">Contact me</a>
                </div>
                <hr className={styles.hr} />
                <div className={styles.footerII}>
                    <p>&copy; 2021 Abdulrasheed Ibrahim. All rights reserved.</p>
                    <a href="#p">Privacy Policy</a>
                </div>
            </div>
        </div>
    );
})

export default Footer;

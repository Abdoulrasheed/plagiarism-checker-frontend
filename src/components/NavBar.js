import React from 'react';
import { routes } from '../pages/routes';
import { withRouter } from 'react-router-dom';

import styles from "../static/css/nav.module.css"
import logo from "../static/images/logo_colored.svg"

const NavBar = withRouter(({history}) => {
    return (
        <nav className={styles.nav}>
            <div className={styles.logo} onClick={()=>history.push(routes.homePage)}>
                <img src={logo} alt="logo" className={styles.logo} />
            </div>
            <ul className={styles.navItems}>
                <li><span onClick={()=> history.push(routes.homePage)}>Home</span></li>
                <li><span onClick={()=> history.push(routes.aboutPage)}>About</span></li>
                <li><span><a target="blank" href="https://abdull.dev/">Contact</a></span></li>
                
                <span className={styles.actionContainer}>
                    <button className={styles.callToaAtion} onClick={()=>history.push(routes.mainPage)}>Launch App</button>
                    <span className={styles.languageIcon}></span>
                    <span className={styles.languageText}>Eng</span>
                </span>
            </ul>
        </nav>
    );
})

export default NavBar;

import React from 'react';

import styles from "../static/css/watch.module.css"
import bg from "../static/video/bg.webm"

const Watch = () => {
    return (
        <div className={styles.watchContainer}>

            <div className={styles.videoBgContainer}>
                <video className={styles.videoBg} autoPlay loop muted>
                    <source src={bg} type="video/mp4" />
                </video>
            </div>

            <div className={styles.info}>
                <h1 className={styles.title}>
                    <p>Online</p>
                    Instant Plagiarism Detector
                </h1>
               <p className={styles.subtitle}>Supports <span>docx</span> and <span>direct text </span> entry</p>
            </div>

            <div></div>
        </div>
    );
}

export default Watch;

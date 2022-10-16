import React from "react";
import styles from "./loader.module.scss";

export default function Loader() {
    return (
        <div className={styles.loading}>
            <div className={styles.ldsRoller}>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>
                <div/>

                <img className={styles.logo} src={'/images/logo.png'} alt="logo"/>
            </div>
        </div>
    )
}

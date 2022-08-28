import React from "react";

import styles from "./loading.module.scss";

export default function Loading() {
    return (
        <div className={styles.loading}>
            <div className={styles.ldsRoller}>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
    )
}

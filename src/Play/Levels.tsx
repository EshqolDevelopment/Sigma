import styles from "./levels.module.scss";
import React from "react";
import {Level} from "../Global";

export function Levels(props: { shortVersion?: boolean, onClick?: (level: Level) => void }) {
    return <div className={styles.levelsList}>
        <div>
            <h3>For all your beginners :)</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/beginner.png"}/>
                <button className={styles.easy} onClick={() => props.onClick("easy")}>Easy</button>
            </div>
            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Check if a number is prime</li>
                    <li>Check if a string is palindrome</li>
                    <li>Get the median from list of numbers</li>
                </ul>
                <span>Average time limit per question: 7 minutes</span>
            </div>}
        </div>

        <div>
            <h3>For intermediate programmers</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/intermediate.png"}/>
                <button onClick={() => props.onClick("medium")} className={styles.medium}>Medium</button>
            </div>

            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Check if a number is prime</li>
                    <li>Check if a string is palindrome</li>
                    <li>Get the median from list of numbers</li>
                </ul>
                <span>Average time limit per question: 20 minutes</span>
            </div>}
        </div>

        <div>
            <h3>For experienced programmers</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/expert.png"}/>
                <button onClick={() => props.onClick("hard")} className={styles.hard}>Hard</button>
            </div>

            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Check if a number is prime</li>
                    <li>Check if a string is palindrome</li>
                    <li>Get the median from list of numbers</li>
                </ul>
                <span>Average time limit per question: 50 minutes</span>
            </div>}
        </div>
    </div>;
}

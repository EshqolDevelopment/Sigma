import styles from "./levels.module.scss";
import React, {useContext, useRef, useState} from "react";
import {Level} from "../../DataTypes";
import {GlobalContext} from "../../Global";
import LoginModal from "../../Authentication/LoginModal";
import EarnCoins from "../../CommonComponents/EarnCoins/EarnCoins";



export function Levels(props: { shortVersion?: boolean, onClick: (level: Level) => void, hideCoins?: boolean, hideTimeLimit?: boolean }) {
    const globalContext = useContext(GlobalContext);
    const [showLogin, setShowLogin] = useState(false);
    const chosenLevel = useRef<Level | null>(null);
    const [showCoinsShop, setShowCoinsShop] = useState(false);

    const LevelToCoins = {
        easy: 50,
        medium: 300,
        hard: 1000
    }

    const onLevelSelected = (level: Level, force?: boolean) => {
        chosenLevel.current = level;

        if (globalContext.username || force) {
            if (LevelToCoins[level] > globalContext.userData?.coins) {
                setShowCoinsShop(true);
            } else {
                props.onClick(level)
            }
        } else {
            setShowLogin(true);
        }
    }

    return <div className={styles.levelsList}>
        <div>
            <h3>For all your beginners :)</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/beginner.png"} alt={"beginner programmer"}/>
                <button className={styles.easy} onClick={() => onLevelSelected("easy")}>Easy<br/>{!props.hideCoins && `(${LevelToCoins.easy} coins)`}</button>
            </div>
            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Check if a number is prime</li>
                    <li>Check if a string is palindrome</li>
                    <li>Get the median from list of numbers</li>
                </ul>
                {!props.hideTimeLimit && <span>Average time limit per question: 7 minutes</span>}
            </div>}
        </div>

        <div>
            <h3>For intermediate programmers</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/intermediate.png"} alt={"intermediate programmer"}/>
                <button onClick={() => onLevelSelected("medium")} className={styles.medium}>Medium<br/>{!props.hideCoins && `(${LevelToCoins.medium} coins)`}</button>
            </div>

            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Get the index of a number in the fibonacci sequence</li>
                    <li>Queen attack in chess</li>
                    <li>Add two binary numbers</li>
                </ul>
                {!props.hideTimeLimit && <span>Average time limit per question: 20 minutes</span>}
            </div>}
        </div>

        <div>
            <h3>For experienced programmers</h3>
            <div className={styles.levelDesignContainer}>
                <img src={"/images/expert.png"} alt={"expert programmer"}/>
                <button onClick={() => onLevelSelected("hard")} className={styles.hard}>Hard<br/>{!props.hideCoins && `(${LevelToCoins.hard} coins)`}</button>
            </div>

            {!props.shortVersion && <div className={styles.levelDetails}>
                <h4>Questions in this category include</h4>
                <ul>
                    <li>Determinate the result of a tic-tac-toe game</li>
                    <li>Find the shortest path in a maze</li>
                    <li>Validate parentheses in a string</li>
                </ul>
                {!props.hideTimeLimit && <span>Average time limit per question: 50 minutes</span>}
            </div>}
        </div>

        {showCoinsShop && <EarnCoins close={() => setShowCoinsShop(false)}/>}
        <LoginModal show={showLogin} setShow={setShowLogin} onLogin={() => onLevelSelected(chosenLevel.current, true)}/>
    </div>;
}

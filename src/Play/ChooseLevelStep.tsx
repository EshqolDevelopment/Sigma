import styles from "./play.module.scss";
import {Levels} from "./Levels";
import React from "react";

export function ChooseLevelStep() {
    return <div className={styles.chooseLevelContainer}>

        <div className={styles.upper}>
            <div className={[styles.title, styles.chooseStepTitle].join(" ")}>
                <h1>Choose the difficulty mode you want to play in</h1>
                <p>
                    Choose the difficulty mode you want to play in.
                    <br/>
                    The leve differ in the time limit of each question and the difficulty of each question.
                </p>
            </div>
        </div>

        <div className={styles.levelsContainer}>
            <Levels onClick={searchForMatch}/>
        </div>

        <dialog className={styles.loading} ref={loadingDialog}>
            <span>Searching for opponent...</span>

            <img src={"https://cdn.dribbble.com/users/544814/screenshots/3838751/dribbble_hourglass.gif"}/>

            <button>Cancel</button>
        </dialog>
    </div>;
}

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
            <Levels onClick={setLevel}/>
        </div>

        {level && <SearchForMatch level={level} setLevel={setLevel}/>}


    </div>;
}

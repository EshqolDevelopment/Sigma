import React, {useState} from "react";
import styles from "./play.module.scss";
import { Levels } from "./Levels";
import { Level} from "../Global";
import SearchForMatch from "../Home/SearchForMatch";
import {SinglePlayerGameData} from "../DataTypes";



export function SinglePlayer() {
    const [level, setLevel] = useState<Level | "">("");
    const [gameData, setGameData] = useState<SinglePlayerGameData | null>(null);

    return (<>
        {!gameData && <div className={styles.chooseLevelContainer}>

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

            {level && <SearchForMatch level={level} setLevel={setLevel} onMatchFind={setGameData}/>}
        </div>}

        {gameData && <p>sdgsdfgdfgdfs</p>}

    </>)
}

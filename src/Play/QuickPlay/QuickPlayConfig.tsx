import React, {useState} from "react";
import styles from "../Setup/play.module.scss";
import { Levels } from "../Setup/Levels";
import SearchForMatch from "../../Home/SearchForMatch";
import {Level, QuickPlayGameData} from "../../DataTypes";
import QuickPlayGame from "./QuickPlayGame";
import {Helmet} from "react-helmet";


export function QuickPlayConfig() {
    const [level, setLevel] = useState<Level | "">("");
    const [gameData, setGameData] = useState<QuickPlayGameData | null>(null);

    return (<>

        <Helmet>
            <title>Sigma Code Wars | Quick Play</title>
            <meta name={"description"} content={"Play Sigma Code Wars against a random opponent in quick play mode."}/>
        </Helmet>

        <main>
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

                {level && <SearchForMatch level={level} setLevel={setLevel} setGameData={setGameData}/>}
            </div>}

            {gameData && <QuickPlayGame gameData={gameData}/>}
        </main>

    </>)
}

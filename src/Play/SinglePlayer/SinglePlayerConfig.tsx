import React, {useEffect, useState} from "react";
import styles from "../Setup/play.module.scss";
import { Levels } from "../Setup/Levels";
import {Level} from "../../DataTypes";
import {Helmet} from "react-helmet";
import Footer from "../../CommonComponents/Footer/Footer";
import SinglePlayerConfigDialog from "./SinglePlayerConfigDialog";


export function SinglePlayerConfig() {
    const [level, setLevel] = useState<Level | "">("");

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
    }, [])

    return (<>

        <Helmet>
            <title>Single Player Mode | Sigma Code Wars</title>
            <meta name={"description"} content={"Play Sigma Code Wars against yourself in single player mode."}/>
        </Helmet>

        <main>
            <div className={styles.chooseLevelContainer}>
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
                    <Levels onClick={setLevel} hideCoins={true} hideTimeLimit={true}/>
                </div>
            </div>

            {level && <SinglePlayerConfigDialog close={() => setLevel("")}/>}

        </main>

        <Footer/>

    </>)
}

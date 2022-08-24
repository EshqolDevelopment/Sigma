import {QuickPlayGameData} from "../../DataTypes";
import {useContext, useState} from "react";
import SeekBarSinglePlayer from "../../CommonComponents/SeekBar/SeekBarSinglePlayer";
import {GlobalContext} from "../../Global";
import styles from "./quickPlay.module.scss";
import {Trophy} from "../../init/Svg";
import QuickPlayQuestionWrapper from "./QuickPlayQuestionWrapper";

type Props = {
    gameData: QuickPlayGameData;
}

export default function QuickPlayGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);
    const globalContext = useContext(GlobalContext);
    const [score, setScore] = useState([0, 0]);
    const [lastQuestionState, setLastQuestionState] = useState<"" | "won" | "lost" | "draw">("");
    const timeToWait = 1500;

    const won = () => {
        setLastQuestionState("won");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1]]);
        setTimeout(() => {
            setLastQuestionState("");
        }, timeToWait);
    };

    const lost = () => {
        setLastQuestionState("lost");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0], score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, timeToWait);
    };

    const draw = () => {
        setLastQuestionState("draw");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, timeToWait);
    };

    return (<div>
        {Math.max(score[0], score[1]) < 3 && <>
            {!lastQuestionState &&
                <QuickPlayQuestionWrapper
                    gameData={props.gameData}
                    questionNumber={questionNumber}
                    won={won}
                    lost={lost}
                    draw={draw}
                />
            }

            {lastQuestionState === "won" && <div className={styles.wonLoadingScreen}>
                <h3>You won!</h3>
                <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>

                <img src={"/images/happy.gif"}/>
            </div>}

            {lastQuestionState === "lost" && <div className={styles.lostLoadingScreen}>
                <h3>You lost!</h3>
                <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>
                <img src={"/images/sad.gif"}/>
            </div>}

            {lastQuestionState === "draw" && <div className={styles.drawLoadingScreen}>
                <h3>You lost!</h3>
                <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>
                <img src={"/images/sad.gif"}/>
            </div>}

            <SeekBarSinglePlayer steps={3} currentStep={score[0]}/>
        </>}


        {Math.max(score[0], score[1]) >= 3 && <div className={styles.gameSummary}>
            <h3>{score[0] > score[1] ? "You won the game!" : "You lost the game!"}</h3>
            <span>Score: {score[0]} - {score[1]}</span>
            <div className={styles.playersSummaryContainer}>
                <div className={styles.playerScoreContainer}>
                    {score[0] > score[1] && <>
                        <Trophy/>
                        <img className={styles.crown} src={"/images/crown.png"}/>
                    </>}
                    <img src={"/images/p1.png"}/>
                    <span>{globalContext.userName}</span>
                </div>

                <div className={styles.playerScoreContainer}>
                    {score[1] > score[0] && <>
                        <Trophy/>
                        <img className={styles.crown} src={"/images/crown.png"}/>
                    </>}
                    <img src={"/images/p2.png"}/>
                    <span>{props.gameData.opponentName}</span>
                </div>
            </div>

            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Go Home</button>
            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Play Again</button>
        </div>}


    </div>);

}

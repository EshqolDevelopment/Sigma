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
    const TransitionTimeBetweenQuestions = 3000;

    const won = () => {
        setLastQuestionState("won");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1]]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
    };

    const lost = () => {
        setLastQuestionState("lost");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0], score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
    };

    const draw = () => {
        setLastQuestionState("draw");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
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

                <img src={"/images/happy.gif"} alt={"happy face emoji"}/>
            </div>}

            {lastQuestionState === "lost" && <div className={styles.lostLoadingScreen}>
                <h3>You lost!</h3>
                <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>
                <img src={"/images/sad.gif"} alt={"sad face emoji"}/>
            </div>}

            {lastQuestionState === "draw" && <div className={styles.drawLoadingScreen}>
                <h3>Draw!</h3>
                <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>
                <img src={"/images/draw_face.png"} alt={"face without any feeling"}/>
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
                        <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                    </>}
                    <img src={`/images/p${globalContext.userData.image}.png`} alt={"Your profile"}/>
                    <span>{globalContext.username}</span>
                </div>

                <div className={styles.playerScoreContainer}>
                    {score[1] > score[0] && <>
                        <Trophy/>
                        <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                    </>}
                    <img src={`/images/p${props.gameData.opponent.image}.png`} alt={"Opponent profile"}/>
                    <span>{props.gameData.opponent.name}</span>
                </div>
            </div>

            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Go Home</button>
            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Play Again</button>
        </div>}

    </div>);

}

import {SinglePlayerGameData} from "../DataTypes";
import Question from "../CommonComponents/Question/Question";
import {useContext, useEffect, useState} from "react";
import {SeekBar} from "../CommonComponents/Question/SeekBar";
import {GlobalContext, postRequest} from "../Global";
import {ref, onValue} from "firebase/database";
import {db} from "../init/firebase";
import styles from "./singlePlayer.module.scss";


type Props = {
    gameData: SinglePlayerGameData;
}


export default function SinglePlayerGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);
    const globalContext = useContext(GlobalContext)
    const [score, setScore] = useState([0, 0]);
    const [lastQuestionState, setLastQuestionState] = useState<"" | "won" | "lost">("");

    const won = () => {
        setLastQuestionState("won");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1]]);
        setTimeout(() => {
            setLastQuestionState("");
        }, 3000);
    }

    const lost = () => {
        setLastQuestionState("lost");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0], score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, 3000);
    }

    useEffect(() => {

        const winnerRef = ref(db,`quick-play/${props.gameData.gameCode}/winner${questionNumber}`);
        const listener = onValue(winnerRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data === globalContext.userName) {
                    won();
                } else {
                    lost();
                }
            }
        });

        return () => listener();

    }, [questionNumber]);



    const onCorrectAnswer = async () => {
        const result = await postRequest("/quick-play/onAnswerSuccess", {
            name: globalContext.userName,
            gameCode: props.gameData.gameCode,
            questionNumber: questionNumber,
        })
        console.log(result);
    }

    return (
        <div>
            {Math.max(score[0], score[1]) < 3 && <>
                {!lastQuestionState && <Question funcName={props.gameData.questions[questionNumber]}
                                                   numberOfQuestions={props.gameData.questions.length}
                                                   currentQuestionNum={questionNumber}
                                                   onCorrectAnswer={onCorrectAnswer}
                />}

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

                <SeekBar steps={3} currentStep={score[0]}/>
            </>}


            {Math.max(score[0], score[1]) >= 3 && <div className={styles.gameSummary}>
                <h3>{score[0] > score[1] ? "You won the game!" : "You lost the game!"}</h3>
                <span>Score: {score[0]} - {score[1]}</span>
                <div className={styles.playersSummaryContainer}>
                    <div className={styles.playerScoreContainer}>
                        {score[0] > score[1] && <img className={styles.crown} src={"/images/crown.png"}/>}
                        <img src={"/images/p1.png"}/>
                        <span>{globalContext.userName}</span>
                    </div>

                    <div className={styles.playerScoreContainer}>
                        {score[1] > score[0] && <img className={styles.crown} src={"/images/crown.png"}/>}
                        <img src={"/images/p2.png"}/>
                        <span>{props.gameData.opponent}</span>
                    </div>
                </div>

                <button className={["sigma-button", styles.summaryBtn].join(" ")}>Go Home</button>
                <button className={["sigma-button", styles.summaryBtn].join(" ")}>Play Again</button>
            </div>}

        </div>
    )
}

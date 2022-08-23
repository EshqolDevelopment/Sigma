import {SinglePlayerGameData} from "../DataTypes";
import Question from "../CommonComponents/Question/Question";
import {useContext, useEffect, useRef, useState} from "react";
import {SeekBar} from "../CommonComponents/Question/SeekBar";
import {GlobalContext, postRequest} from "../Global";
import {ref, onValue, get} from "firebase/database";
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
        setTimeout(() => {
            setScore([score[0] + 1, score[1]]);
            setLastQuestionState("");
        }, 3000);
    }

    const lost = () => {
        setLastQuestionState("lost");
        setQuestionNumber(questionNumber + 1);
        setTimeout(() => {
            setScore([score[0], score[1] + 1]);
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
            {questionNumber !== 3 && <>
                {!lastQuestionState && <Question funcName={props.gameData.questions[questionNumber]}
                                                   numberOfQuestions={props.gameData.questions.length}
                                                   currentQuestionNum={questionNumber}
                                                   onCorrectAnswer={onCorrectAnswer}
                />}

                {lastQuestionState === "won" && <div className={styles.wonLoadingScreen}>
                    <h3>You won!</h3>
                    <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                    <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>

                    <img src={"/images/timer.gif"}/>
                </div>}

                {lastQuestionState === "lost" && <div className={styles.lostLoadingScreen}>
                    <h3>You lost!</h3>
                    <span className={styles.loadDesc}>You will be redirected to the next question in 3 seconds...</span>
                    <span className={styles.scoreText}>Score: {score[0]} - {score[1]}</span>
                    <img src={"/images/timer.gif"}/>
                </div>}

                <SeekBar steps={props.gameData.questions.length} currentStep={questionNumber}/>
            </>}


            {Math.max(score[0], score[1]) === 3 && <div className={styles.gameSummary}>
                <span>Game Summary</span>
            </div>}

        </div>
    )
}

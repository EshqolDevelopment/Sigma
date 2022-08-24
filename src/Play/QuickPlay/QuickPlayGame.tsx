import {QuickPlayGameData} from "../../DataTypes";
import Question from "../../CommonComponents/Question/Question";
import {useContext, useEffect, useRef, useState} from "react";
import SeekBarSinglePlayer from "../../CommonComponents/SeekBar/SeekBarSinglePlayer";
import {GlobalContext, postRequest} from "../../Global";
import {onValue, ref} from "firebase/database";
import {db} from "../../init/firebase";
import styles from "./quickPlay.module.scss";
import {Trophy} from "../../init/Svg";
import DrawDecisionDialog from "./DrawDesicionDialog";
import {toast, ToastContainer} from "react-toastify";

type Props = {
    gameData: QuickPlayGameData;
}

type DrawData = {
    name?: string;
    response?: "accepted" | "rejected" | "waiting";
}

export default function QuickPlayGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);
    const globalContext = useContext(GlobalContext);
    const [score, setScore] = useState([0, 0]);
    const [lastQuestionState, setLastQuestionState] = useState<"" | "won" | "lost" | "draw">("");
    const [waitingForDrawDecision, setWaitingForDrawDecision] = useState(false);
    const [offerDrawAlreadySentRef, setOfferDrawAlreadySentRef] = useState([] as boolean[]);
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

    useEffect(() => {
        const winnerRef = ref(db, `quick-play/${props.gameData.gameCode}/winner${questionNumber}`);
        const drawRef = ref(db, `quick-play/${props.gameData.gameCode}/draw${questionNumber}`);
        const winnerListener = onValue(winnerRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data === globalContext.userName) {
                    won();
                } else if (data === "draw") {
                    draw();
                } else {
                    lost();
                }
            }
        });

        const waitForDrawResponse = new Promise((resolve, reject) => {
            const drawListener = onValue(drawRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val() as DrawData;
                    if (data.name === globalContext.userName) {
                        if (data.response === "accepted") {
                            resolve("offer accepted");
                        } else if (data.response === "rejected") {
                            reject("offer rejected");
                        }
                    }

                }
            });
            return () => drawListener();
        });

        const drawListener = onValue(drawRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val() as DrawData;
                if (data.name === globalContext.userName && data.response === "waiting") {
                    toast.promise(waitForDrawResponse, {
                        pending: 'Waiting for response from your opponent',
                        success: 'Your opponent accepted your draw offer',
                        error: 'Your opponent rejected your draw offer',
                    })
                } else if (data.response === "waiting") {
                    setWaitingForDrawDecision(true);
                } else {
                    setWaitingForDrawDecision(false);
                }
            }
        });

        return () => {
            winnerListener();
            drawListener();
        };

    }, [questionNumber, props.gameData]);


    const onCorrectAnswer = async () => {
        const result = await postRequest("/quick-play/onAnswerSuccess", {
            name: globalContext.userName,
            gameCode: props.gameData.gameCode,
            questionNumber: questionNumber
        });
        console.log(result);
    };

    const suggestDraw = async () => {
        const result = await postRequest("/quick-play/suggestDraw", {
            name: globalContext.userName,
            gameCode: props.gameData.gameCode,
            questionNumber: questionNumber
        });
        console.log(result);
    };

    const answerDraw = async (accept: boolean) => {
        const result = await postRequest("/quick-play/drawAnswer", {
            name: globalContext.userName,
            gameCode: props.gameData.gameCode,
            questionNumber: questionNumber,
            accept: accept
        });
    }


    return (<div>
        {Math.max(score[0], score[1]) < 3 && <>
            {!lastQuestionState &&
                <Question funcName={props.gameData.questions[questionNumber]}
                          numberOfQuestions={props.gameData.questions.length}
                          currentQuestionNum={questionNumber}
                          onCorrectAnswer={onCorrectAnswer}
                          suggestDrawAction={suggestDraw}
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


        {waitingForDrawDecision && <DrawDecisionDialog
                    opponentName={props.gameData.opponentName}
                    onAccept={() => answerDraw(true) }
                    onDecline={() => answerDraw(false)}
        />}

        <ToastContainer />
    </div>);

}

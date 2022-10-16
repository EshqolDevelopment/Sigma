import {QuickPlayGameData, QuickPlayGameFinished} from "../../DataTypes";
import {useContext, useState} from "react";
import SeekBarSinglePlayer from "../../CommonComponents/SeekBar/SeekBarSinglePlayer";
import {GlobalContext, postRequest} from "../../Global";
import styles from "./quickPlay.module.scss";
import QuickPlayQuestionWrapper from "./QuickPlayQuestionWrapper";
import {GameSummary} from "./GameSummary";

type Props = {
    gameData: QuickPlayGameData;
}

export default function QuickPlayGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);
    const globalContext = useContext(GlobalContext);
    const [score, setScore] = useState([0, 0]);
    const [lastQuestionState, setLastQuestionState] = useState<"" | "won" | "lost" | "draw">("");
    const [gameFinishedData, setGameFinishedData] = useState<QuickPlayGameFinished>();
    const TransitionTimeBetweenQuestions = 3000;

    const won = () => {
        setLastQuestionState("won");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1]]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
        checkIfGameFinishedAndWin([score[0] + 1, score[1]])
    };

    const lost = () => {
        setLastQuestionState("lost");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0], score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
        checkIfGameFinishedAndWin([score[0], score[1] + 1])
    };

    const draw = () => {
        setLastQuestionState("draw");
        setQuestionNumber(questionNumber + 1);
        setScore([score[0] + 1, score[1] + 1]);
        setTimeout(() => {
            setLastQuestionState("");
        }, TransitionTimeBetweenQuestions);
        checkIfGameFinishedAndWin([score[0] + 1, score[1] + 1])
    };

    const checkIfGameFinishedAndWin = (score) => {
        if (Math.max(score[0], score[1]) >= 3) {
            postRequest("/quick-play/onGameFinished", {
                name: globalContext.userData.name,
                opponent: props.gameData.opponent.name,
                gameCode: props.gameData.gameCode,
                level: props.gameData.level,
                questions: props.gameData.questions,
            }).then((data: QuickPlayGameFinished) => {
                setGameFinishedData(data);
            })
        }
    }

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


        {Math.max(score[0], score[1]) >= 3 &&
            <GameSummary
                score={score}
                gameData={props.gameData}
                gameFinishedData={gameFinishedData}
        />}

    </div>);

}

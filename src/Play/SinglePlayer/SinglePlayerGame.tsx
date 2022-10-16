import {useContext, useEffect, useRef, useState} from "react";
import {GlobalContext, postRequest} from "../../Global";
import Question from "../../CommonComponents/Question/Question";
import multiPlayerStyles from "../MultiPlayer/multiPlayerGame.module.scss";
import s from "./singlePlayer.module.scss";
import {Link} from "react-router-dom";
import NewRecord from "./NewRecord";

function shuffleArray(arr) {
    const array = [...arr];
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}


export default function SinglePlayerGame() {
    const globalContext = useContext(GlobalContext);
    const [questions, setQuestions] = useState<string[]>([]);
    const [questionNumber, setQuestionNumber] = useState(0);
    const [inTransition, setInTransition] = useState(false);
    const [finished, setFinished] = useState<number>(null);
    const [record, setRecord] = useState<number>(null);
    const startTimeRef = useRef(Date.now());

    const searchParams = new URLSearchParams(window.location.search);
    const numberOfQuestions = searchParams.get("questions")
    const questionLevel = searchParams.get("level")
    if (!numberOfQuestions || isNaN(parseInt(numberOfQuestions)) || !["easy", "medium", "hard"].includes(questionLevel)) {
        window.location.href = "/404";
    }

    useEffect(() => {
        const questionsList = globalContext.questionNames?.[questionLevel];
        if (questionsList) {
            const shuffledList = shuffleArray(questionsList);
            const questions = shuffledList.slice(0, parseInt(numberOfQuestions));
            setQuestions(questions);
        }
    }, [globalContext.questionNames]);

    const onQuestionAnswered = () => {
        if (questionNumber + 1 === questions.length) {
            const currentTime = Date.now();
            const time = (currentTime - startTimeRef.current) / 1000;
            setFinished(currentTime);
            onGameFinished(time);
            return;
        }

        setInTransition(true);
        setTimeout(() => {
            setQuestionNumber(questionNumber + 1);
            setInTransition(false);
        }, 3000);
    }

    const onGameFinished = async (time: number) => {
        const res = await postRequest("/single-play/onGameFinished", {
            time,
            level: questionLevel,
            name: globalContext.userData?.name,
            numberOfQuestions: questions.length,
        }) as {newRecord: boolean, time: number};

        if (res.newRecord) {
            setRecord(res.time);
        }
    }

    return (
        <div>
            {!finished && <>
                {questions.length && !inTransition && <Question funcName={questions[questionNumber]}
                                                                practiceTimer={true}
                                                                onCorrectAnswer={onQuestionAnswered}/>}

                {inTransition && <div className={multiPlayerStyles.wonLoadingScreen}>
                    <h3>You answer correctly!<br/>
                        You have {questions.length - questionNumber - 1} more questions to go!</h3>
                    <img src={"/images/timer.gif"} alt={"timer"}/>
                </div>}
            </>}

            {finished && <div className={[multiPlayerStyles.finishContainer, s.finishContainer].join(" ")}>
                <h2>You finished the game in {Math.round((finished - startTimeRef.current) / 1000)} seconds!</h2>
                <img src={"/images/finish.png"}/>

                <div className={s.buttonsContainer}>
                    <Link to={"/single-player"} className={s.finishBtn}>Play again</Link>
                    <Link to={"/"} className={s.finishBtn}>Home</Link>
                </div>

            </div>}

            {record && <NewRecord record={record} close={() => setRecord(null)}/>}

        </div>
    )
}

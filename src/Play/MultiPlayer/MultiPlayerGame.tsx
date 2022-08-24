import {PlayersData} from "../../DataTypes";
import {useContext, useEffect, useRef, useState} from "react";
import {onValue, ref} from "firebase/database";
import {db} from "../../init/firebase";
import {GlobalContext, postRequest} from "../../Global";
import Question from "../../CommonComponents/Question/Question";
import styles from "./multiPlayerGame.module.scss";
import SeekBarMultiPlayer from "../../CommonComponents/SeekBar/SeekBarMultiPlayer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Props = {
    code: string;
    questions: string[];
    level: string;
    players: PlayersData;
    numberOfQuestions: number;
}


export default function MultiPlayerGame(props: Props) {
    const globalContext = useContext(GlobalContext);
    const [playersData, setPlayersData] = useState<PlayersData>(props.players);
    const [inTransition, setInTransition] = useState(false);

    const notify = (text: string) => toast.info(text);

    useEffect(() => {
        const groupRef = ref(db,  `multi-play/${props.code}/players`);
        const listener = onValue(groupRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val() as PlayersData;

                setPlayersData((lastPlayersData) => {
                    for (let playerName in data) {
                        const currentQuestion = data[playerName].currentQuestion;
                        const lastQuestion = lastPlayersData[playerName].currentQuestion;
                        if (currentQuestion !== lastQuestion) {
                            notify(`${playerName} moved to question ${currentQuestion + 1}`);
                        }
                    }
                    return data;
                });
            }
        });
        return () => listener();
    }, [props.code])


    const onCorrectAnswer = async () => {
        const res = await postRequest("/multi-play/onAnswerSuccess", {
            name: globalContext.userName,
            code: props.code,
        })

        if (res.result === "OK") {
            setInTransition(true);
            setTimeout(() => {
                setInTransition(false);
            }, 3000);
        }
    }


    return (
        <div>
            {!inTransition && <Question funcName={props.questions[playersData[globalContext.userName].currentQuestion]}
                      numberOfQuestions={props.questions.length}
                      currentQuestionNum={playersData[globalContext.userName].currentQuestion}
                      onCorrectAnswer={onCorrectAnswer}
            />}

            {inTransition && <div className={styles.wonLoadingScreen}>
                <h3>You answer correctly!<br/>
                    You have two more questions remaining</h3>
                <img src={"/images/timer.gif"}/>
            </div>}

            <SeekBarMultiPlayer steps={props.numberOfQuestions}
                                currentStep={playersData[globalContext.userName].currentQuestion}
                                playersData={playersData}/>

            <ToastContainer />
        </div>
    )
}

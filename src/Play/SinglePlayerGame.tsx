import {SinglePlayerGameData} from "../DataTypes";
import Question from "../CommonComponents/Question/Question";
import {useContext, useEffect, useState} from "react";
import {SeekBar} from "../CommonComponents/Question/SeekBar";
import {GlobalContext, postRequest} from "../Global";
import {ref, onValue, get} from "firebase/database";
import {db} from "../init/firebase";


type Props = {
    gameData: SinglePlayerGameData;
}


export default function SinglePlayerGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);
    const globalContext = useContext(GlobalContext)

    const won = () => {
        console.log("You won!");
    }

    const lost = () => {
        console.log("You lost");
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
            <Question funcName={props.gameData.questions[0]}
                      numberOfQuestions={props.gameData.questions.length}
                      currentQuestionNum={questionNumber}
                      onCorrectAnswer={onCorrectAnswer}
            />

            <SeekBar steps={props.gameData.questions.length} currentStep={0}/>
        </div>
    )
}

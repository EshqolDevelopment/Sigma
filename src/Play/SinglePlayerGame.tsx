import {SinglePlayerGameData} from "../DataTypes";
import Question from "../CommonComponents/Question/Question";
import {useState} from "react";

type Props = {
    gameData: SinglePlayerGameData;
}

export default function SinglePlayerGame(props: Props) {
    const [questionNumber, setQuestionNumber] = useState(0);

    return (
        <div>
            <Question funcName={props.gameData.questions[questionNumber]}
                      numberOfQuestions={props.gameData.questions.length}
                      currentQuestionNum={questionNumber}
                      seekBar={true}
            />
        </div>
    )
}

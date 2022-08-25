import {useEffect, useState} from "react";
import Question from "../CommonComponents/Question/Question";

export default function PracticeQuestionWrapper() {
    const [funcName, setFuncName] = useState<string>(null);

    useEffect(() => {
        const location = window.location.pathname.split("/");
        const funcName = location.at(-1);
        setFuncName(funcName);
    }, [])

    return (
        <div>
            {funcName && <Question funcName={funcName}
                                   numberOfQuestions={1}
            />}
        </div>
    )
}

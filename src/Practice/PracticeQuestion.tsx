import {useEffect, useState} from "react";
import Question from "../CommonComponents/Question/Question";

export default function PracticeQuestion() {
    const [funcName, setFuncName] = useState<string>(null);

    useEffect(() => {
        const location = window.location.pathname.split("/").slice(1);
        const questionName = location[1].replaceAll("%20", " ");
        const funcName = questionName.replaceAll(" ", "_").toLowerCase();
        setFuncName(funcName);
    })

    return (
        <div>
            {funcName && <Question funcName={funcName} numberOfQuestions={1} seekBar={false}/>}
        </div>
    )
}

import Question from "../Question/Question";
import {useContext, useEffect, useState} from "react";
import {GlobalContext, postRequest} from "../../Global";
import {Level} from "../../DataTypes";


export default function Challenge() {
    const [level, setLevel] = useState<Level>(null);
    const globalContext = useContext(GlobalContext);

    const questions = {
        easy: "bigger_than_10",
        medium: "sum_of_primes",
        hard: "area_of_triangle"
    }

    useEffect(() => {
        const location = window.location.pathname.split("/");
        const level = location.at(-1);
        setLevel(level as Level);
    }, [])

    const onCorrect = () => {
        postRequest("/general/completeChallenge", {
            level: level,
            name: globalContext.userData.name,
        });
    }

    return (
        <div>
            {questions[level] && <Question funcName={questions[level]} onCorrectAnswer={onCorrect} challenge={true} level={level}/>}
        </div>
    )
}

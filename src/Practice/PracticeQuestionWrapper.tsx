import React, {useEffect, useState} from "react";
import Question from "../CommonComponents/Question/Question";
import {Helmet} from "react-helmet";
import {questionName} from "../Global";


export default function PracticeQuestionWrapper() {
    const [funcName, setFuncName] = useState<string>(null);

    useEffect(() => {
        const location = window.location.pathname.split("/");
        const funcName = location.at(-1);
        setFuncName(funcName);
    }, [])

    return (
        <div>
            <Helmet>
                <title>{questionName(funcName)} | Sigma Code Wars</title>
                <meta name={"description"} content={"Practice the Sigma Code Wars question " + questionName(funcName)}/>
            </Helmet>

            <main>
                <div>
                    {funcName && <Question funcName={funcName}
                                           practice={true}
                                           showSolution={true}
                    />}
                </div>
            </main>

        </div>

    )
}

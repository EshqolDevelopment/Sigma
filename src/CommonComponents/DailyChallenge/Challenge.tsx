import Question from "../Question/Question";
import React, {useContext} from "react";
import {GlobalContext, postRequest} from "../../Global";
import {useQuery} from "react-query";
import Loading from "../Loading/Loading";
import {Helmet} from "react-helmet";
import NotFound from "../../404/NotFound";


export default function Challenge() {
    const globalContext = useContext(GlobalContext);
    const challengesData = useQuery(["getDailyChallenges", new Date().toLocaleDateString("en-IL")], () => postRequest("/general/getDailyChallenges", {}));
    const location = window.location.pathname.split("/");
    const level = location.at(-1);

    const levels = ["easy", "medium", "hard"];
    const pageExists = levels.includes(level)

    const questions = challengesData?.data || {
        easy: "",
        medium: "",
        hard: ""
    };

    const onCorrect = () => {
        postRequest("/general/completeChallenge", {
            level: level,
            name: globalContext.userData.name,
        });
    }

    return (
        <div>
            {pageExists && <>
                <Helmet>
                    <title>Daily Challenge ({level[0].toUpperCase() + level.slice(1)}) | Sigma Code Wars</title>
                    <meta name={"description"} content={"Take the daily challenge and get a chance to win some coins"}/>
                </Helmet>

                <main>
                    {questions[level] && <Question funcName={questions[level]} onCorrectAnswer={onCorrect} challenge={true} level={level}/>}
                </main>

                {!questions[level] && <Loading/>}
            </>}

            {!pageExists && <NotFound/>}
        </div>
    )
}

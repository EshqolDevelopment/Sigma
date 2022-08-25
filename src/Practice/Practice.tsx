import React, {useEffect, useState} from "react";
import ListOfQuestions from "./ListOfQuestions";
import "./ListOfQuestions.css";
import {postRequest} from "../Global";
import {PracticeQuestionList} from "../DataTypes";

let questionDictGlobal: PracticeQuestionList = {Easy: [], Medium: [], Hard: []};


export default function Practice() {
    const [questionDict, setQuestionDict] = useState<PracticeQuestionList>({Easy: [], Medium: [], Hard: []});
    const [questionIsFiltered, setQuestionIsFiltered] = useState(false);

    async function fetchQuestions() {
        const serverQuestionDict = await postRequest("/general/getQuestionList", {}) as PracticeQuestionList;
        setQuestionDict(serverQuestionDict)
        questionDictGlobal = serverQuestionDict;
    }


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
        fetchQuestions();
    }, []);


    useEffect(() => {
        document.documentElement.style.setProperty("--above-medium", questionDict["Easy"].length.toString());
        document.documentElement.style.setProperty("--above-hard", (questionDict["Easy"].length + questionDict["Medium"].length).toString());
    }, [questionDict]);


    function filterQuestions(event) {
        const text = event.target.value;
        const isFiltered = text.length > 0;
        setQuestionIsFiltered(isFiltered);

        const cols = document.getElementsByClassName('question-item') as HTMLCollectionOf<HTMLDivElement>;
        if (isFiltered) {
            for(let i = 0; i < cols.length; i++) {
                cols[i].style.position = 'static';
                cols[i].style.marginBottom = '6px';
            }
        } else {
            for(let i = 0; i < cols.length; i++) {
                cols[i].style.position = 'absolute';
                cols[i].style.marginBottom = '0px';
            }
        }

        const copyData = {...questionDictGlobal};
        for (const level in copyData) {
            copyData[level] = copyData[level].filter(val => val.name.toLowerCase().replaceAll(" ", "").replaceAll("_", "").includes(text.toLowerCase().replaceAll(" ", "")));
        }
        setQuestionDict(copyData);
    }

    return (
        <div>
            <h1 className={"practice-title"}>Practice any question in your level, supporting over 10 languages!</h1>
            <div className={"filter-container"}>
                <button className={"pickRandom"}>Pick Random</button>
                <input className={"filter-question"} type={"text"} placeholder={"Search for a question"}
                       onChange={filterQuestions}/>
                <img src={"search logo"}/>
            </div>

            <div className={"container"}>
                <div className={"easyCont"}>
                    <p>Easy - 0/25</p>
                    <ListOfQuestions level={"easy"} questionList={questionDict["Easy"]}
                                     aboveListLength={0}
                                     questionIsFiltered={questionIsFiltered}/>
                </div>
                <div className={"mediumCont"}>
                    <p>Medium - 0/25</p>
                    <ListOfQuestions level={"medium"} questionList={questionDict["Medium"]}
                                     aboveListLength={questionDict["Easy"].length}
                                     questionIsFiltered={questionIsFiltered}/>
                </div>
                <div className={"hardCont"}>
                    <p>Hard - 0/25</p>
                    <ListOfQuestions level={"hard"} questionList={questionDict["Hard"]}
                                     aboveListLength={questionDict["Easy"].length + questionDict["Medium"].length}
                                     questionIsFiltered={questionIsFiltered}/>
                </div>
            </div>
        </div>
    )
}

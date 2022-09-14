import React, {useContext, useEffect, useState} from "react";
import ListOfQuestions from "./ListOfQuestions";
import "./ListOfQuestions.scss";
import {GlobalContext, postRequest} from "../Global";
import {PracticeQuestionList} from "../DataTypes";
import {useQuery} from "react-query";
import Loading from "../CommonComponents/Loading/Loading";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";

let questionDictGlobal: PracticeQuestionList = {Easy: [], Medium: [], Hard: []};


export default function Practice() {
    const [questionDict, setQuestionDict] = useState<PracticeQuestionList>({Easy: [], Medium: [], Hard: []});
    const [questionIsFiltered, setQuestionIsFiltered] = useState(false);
    const {isLoading} = useQuery(["question-list"], fetchQuestions);
    const navigate = useNavigate();
    const globalContext = useContext(GlobalContext);

    async function fetchQuestions() {
        const serverQuestionDict = await postRequest("/general/getQuestionList", {}) as PracticeQuestionList;
        const temp = {Easy: [], Medium: [], Hard: []};

        for (let level of ["Easy", "Medium", "Hard"]) {
            const orderArray: string[] = localStorage.getItem("ListIndexes" + level) ? JSON.parse(localStorage.getItem("ListIndexes" + level)) : [];

            if (orderArray.length > 0) {
                for (let i = 0; i < orderArray.length; i++) {
                    const match = serverQuestionDict[level].find((x) => x.name === orderArray[i]);
                    if (match) {
                        temp[level][i] = match;
                    }
                }
                for (const question of serverQuestionDict[level]) {
                    if (!orderArray.includes(question.name)) {
                        temp[level].push(question);
                    }
                }
            } else {
                temp[level] = serverQuestionDict[level];
            }
        }

        setQuestionDict(temp)
        questionDictGlobal = temp;
        return temp;
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
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

    const pickRandom = () => {
        const levels = ["Easy", "Medium", "Hard"];
        const level = levels[Math.floor(Math.random() * levels.length)];
        const questions = questionDict[level];
        const index = Math.floor(Math.random() * questions.length);
        const question = questions[index];
        navigate(`/practice/${question.name}`)
    }

    const sum = questionDictGlobal["Easy"].length + questionDictGlobal["Medium"].length + questionDictGlobal["Hard"].length;
    const solutions = globalContext.solutions ? globalContext.solutions : {};
    const accomplishedPercentage = Math.round(Object.keys(solutions).length / sum * 100);

    return (
        <div>
            <Helmet>
                <title>200+ Coding Question | Sigma Code Wars</title>
                <meta name={"description"} content={"Solve 200+ coding questions in 3 difficulty levels. Practice your coding skills and prepare for interviews."}/>
            </Helmet>


            {isLoading && <Loading/> }
            {!isLoading && <main>

                <div className={"practice-title-container"}>
                    <h1 className={"practice-title"}>200+ Coding Practice Challenges</h1>
                    <h2>The practice you need to become a professional programmer</h2>
                    <input className={"filter-question normalInput"} type={"text"} placeholder={"Search for a question"} onChange={filterQuestions}/>
                </div>

                <div className={`accomplishment-container`}>
                    <span>{Object.keys(solutions).length} Questions Completed out of {sum}</span>
                    {/*@ts-ignore*/}
                    <div style={{"--accomplished-percentage": accomplishedPercentage + "%"}}>
                        <span>{accomplishedPercentage}%</span>
                    </div>
                    <button onClick={pickRandom}>Pick random question</button>
                </div>


                <div className={"container"}>
                    <div className={"easyCont"}>
                        <p>Easy - 0/{questionDict["Easy"].length}</p>
                        <ListOfQuestions level={"easy"} questionList={questionDict["Easy"]}
                                         aboveListLength={0}
                                         questionIsFiltered={questionIsFiltered}/>
                    </div>
                    <div className={"mediumCont"}>
                        <p>Medium - 0/{questionDict["Medium"].length}</p>
                        <ListOfQuestions level={"medium"} questionList={questionDict["Medium"]}
                                         aboveListLength={questionDict["Easy"].length}
                                         questionIsFiltered={questionIsFiltered}/>
                    </div>
                    <div className={"hardCont"}>
                        <p>Hard - 0/{questionDict["Hard"].length}</p>
                        <ListOfQuestions level={"hard"} questionList={questionDict["Hard"]}
                                         aboveListLength={questionDict["Easy"].length + questionDict["Medium"].length}
                                         questionIsFiltered={questionIsFiltered}/>
                    </div>
                </div>
            </main>}
        </div>

    )
}

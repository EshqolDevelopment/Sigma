import React, {useEffect, useState} from "react";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {app} from "../../init/firebase";
import ListOfQuestions from "./ListOfQuestions";
import "./ListOfQuestions.css";

const db = getFirestore(app);
let questionDictGlobal = {};


export default function Container() {
    const [questionDict, setQuestionDict] = useState({Easy: [], Medium: [], Hard: []});
    const [questionIsFiltered, setQuestionIsFiltered] = useState(false);

    async function fetchQuestions() {
        if (sessionStorage["questions"])
            return JSON.parse(sessionStorage["questions"]);

        const data = await getDoc(doc(db, "questions/python"));
        const questions = data.data();

        sessionStorage["questions"] = JSON.stringify(questions);
        return questions;
    }


    async function reformatData() {
        const allQuestions = await fetchQuestions();

        const temp = allQuestions["names"].split("@").map((val, i) => [...val.split("&"), i]);
        const data = {Easy: [], Medium: [], Hard: []};

        for (const level of ["Easy", "Medium", "Hard"]) {
            data[level] = temp.filter(val => val[2] === level);
        }
        setQuestionDict(data);
        questionDictGlobal = data;
    }


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
        reformatData();
    }, []);


    useEffect(() => {
        document.documentElement.style.setProperty("--above-medium", questionDict["Easy"].length.toString());
        document.documentElement.style.setProperty("--above-hard", (questionDict["Easy"].length + questionDict["Medium"].length).toString());
    }, [questionDict]);


    function filterQuestions(event) {
        const text = event.target.value;
        const isFiltered = text.length > 0;
        setQuestionIsFiltered(isFiltered);

        const cols = document.getElementsByClassName('question-item');
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
        for (const level of ["Easy", "Medium", "Hard"]) {
            copyData[level] = copyData[level].filter(val => val[0].toLowerCase().includes(text.toLowerCase()));
        }
        setQuestionDict(copyData);
    }


    return (
        <div className={"box"}>
            <h1 className={"practice-title"}>Practice any question in your level, supporting over 10 languages!</h1>
            <div className={"filter-container"}>
                <button className={"pickRandom"}>Pick Random</button>
                <input className={"filter-question"} type={"text"} placeholder={"Search for a question"}
                       onChange={filterQuestions}/>
                <img src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Search_Icon.svg/1024px-Search_Icon.svg.png"}/>
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

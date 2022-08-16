import Editor from "../init/Editor";
import React, {createRef, useRef, useState} from "react";
//@ts-ignore
import styles from "./sampleQuestion.module.scss";

const questionsList: { name: string; title: string; description: string; }[] = [
    {
        name: "is_prime",
        title: "def is_prime(number: int) -> bool: \n    ",
        description: "Write a function that determinate if a given number is prime",
    },
    {
        name: "is_palindrome",
        title: "def is_palindrome(word: str) -> bool: \n    ",
        description: "Write a function that determinate if a given word is a palindrome",
    }
]
const question = questionsList[Math.floor(Math.random() * questionsList.length)];


export function SampleQuestion() {

    const [sampleQuestionCode, setSampleQuestionCode] = useState(question.title)
    const [sampleQuestionLoadingState, setSampleQuestionLoadingState] = useState("")
    const [result, setResult] = useState("")

    const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const formatName = (name: string) =>  {
        const words = name.split("_");
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
    }

    async function submitSampleQuestion() {
        const language: string = "python"
        const funcName = question.name;

        setSampleQuestionLoadingState("loading")
        const production = false;

        let serverURL: string;
        if (production) {
            serverURL = language === "kotlin" ? "https://py-server.eshqol.com" : "https://js-server.eshqol.com";
        } else {
            serverURL = language === "kotlin" ? "http://localhost:8080" : "http://localhost:8081";
        }

        const response = await fetch(`${serverURL}/${language}`, {
            body: JSON.stringify({
                funcName: funcName,
                code: sampleQuestionCode
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });


        const res = await response.json()
        await sleep(1000)

        setResult(res.result)
        setSampleQuestionLoadingState(res.result === "success" ? "success" : "error")
    }


    return <div className={styles.sampleQuestion}>
        <div className={styles.sampleQuestionTitle}>
            <h4>{formatName(question.name)}</h4>
            <button onClick={submitSampleQuestion}>Submit</button>
        </div>

        <div className={styles.sampleQuestionBody}>
            {!sampleQuestionLoadingState && <>
                <p className={styles.questionDesc}>{question.description}</p>
                <Editor code={sampleQuestionCode} setCode={setSampleQuestionCode} lineNumbers={false}/>
            </>}

            {sampleQuestionLoadingState === "loading" && <div className={styles.loading}>
                <div className={styles.spinner}/>
                <span>Preprocessing your answer...</span>
            </div>}

            {sampleQuestionLoadingState === "error" && <div className={[styles.loading, styles.loadingError].join(" ")}>
                <div className={styles.spinner}/>
                <span aria-label={"Error description"}>{result}</span>
                <button onClick={() => setSampleQuestionLoadingState("")}>Try again</button>
            </div>}

            {sampleQuestionLoadingState === "success" && <div className={[styles.loading, styles.loadingSuccess].join(" ")}>
                <div className={styles.spinner}/>
                <span>Your answer is correct!</span>
            </div>}

        </div>

    </div>;
}

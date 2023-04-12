import Editor from "../init/Editor";
import React, {useState} from "react";
import styles from "./sampleQuestion.module.scss";
import showResultStyle from "../CommonComponents/Question/showResult.module.scss";

import {formatName, postRequest} from "../Global";
import {formatInput} from "../CommonComponents/Question/Question";

const questionsList: { name: string; title: string; description: string; params: string[] }[] = [
    {
        name: "is_prime",
        title: "def is_prime(number: int) -> bool: \n\t",
        description: "Write a function that determinate if a given number is prime",
        params: [["number", "int"]].map((v) =>JSON.stringify(v)),
    },
    {
        name: "is_palindrome",
        title: "def is_palindrome(word: str) -> bool: \n\t",
        description: "Write a function that determinate if a given word is a palindrome",
        params: [["word", "str"]].map((v) =>JSON.stringify(v)),
    },
    {
        name: "check_if_sort",
        title: "def check_if_sort(lst: list) -> bool: \n\t",
        description: "Write a function that determinate if a given list is sorted in non-decreasing order",
        params: [["lst", "list"]].map((v) =>JSON.stringify(v)),
    }
]

const defQuestion = questionsList[Math.floor(Math.random() * questionsList.length)];

export function SampleQuestion() {
    const [question, setQuestion] = useState(defQuestion)
    const [sampleQuestionCode, setSampleQuestionCode] = useState(question.title)
    const [sampleQuestionLoadingState, setSampleQuestionLoadingState] = useState("")
    const [result, setResult] = useState("")

    async function submitSampleQuestion() {
        setSampleQuestionLoadingState("loading")
        const res = await postRequest(`/python`, {
            funcName: question.name,
            code: sampleQuestionCode,
            questionTime: 3600,
        }) as {result: string}

        setResult(res.result)
        setSampleQuestionLoadingState(res.result === "success" ? "success" : "error")
    }

    async function nextQuestion() {
        setSampleQuestionLoadingState("")
        const newQuestion = questionsList[questionsList.indexOf(question) + 1] || questionsList[0];
        setQuestion(newQuestion)
        setSampleQuestionCode(newQuestion.title)
    }

    let input;
    let output;
    let expectedOutput;
    try {
        input = formatInput(question.params, JSON.parse(result).input)
        output = (JSON.parse(result).output).toString()
        expectedOutput = (JSON.parse(result).expected).toString()
    } catch (e) {

    }

    const isJSONRes = input && output && expectedOutput

    return <div className={styles.sampleQuestion}>
        <div className={styles.sampleQuestionTitle}>
            <h4>{formatName(question.name)}</h4>
            <button onClick={sampleQuestionLoadingState === "success" ? nextQuestion : submitSampleQuestion}>{sampleQuestionLoadingState === "success" ? "Next" : "Submit"}</button>
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

                {!isJSONRes && <span aria-label={"Error description"} className={styles.errorResult}>{result}</span>}

                {isJSONRes && <div className={[showResultStyle.testCaseContainer, styles.testCaseContainer].join(" ")}>
                    <div>
                        <span className={showResultStyle.testCaseTitle}>Input:</span>
                        <span className={showResultStyle.testCaseValue}>{input}</span>
                    </div>
                    <div>
                        <span className={showResultStyle.testCaseTitle}>Output:</span>
                        <span className={showResultStyle.testCaseValue}>{output}</span>
                    </div>
                    <div>
                        <span className={showResultStyle.testCaseTitle}>Excepted:</span>
                        <span className={showResultStyle.testCaseValue}>{expectedOutput}</span>
                    </div>
                </div>}

                <button onClick={() => setSampleQuestionLoadingState("")}>Try again</button>
            </div>}

            {sampleQuestionLoadingState === "success" && <div className={[styles.loading, styles.loadingSuccess].join(" ")}>
                <div className={styles.spinner}/>
                <span>Your answer is correct!</span>
            </div>}

        </div>

    </div>;
}

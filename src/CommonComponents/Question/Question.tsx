import {useContext, useEffect, useState} from "react";
import styles from "./question.module.scss";
import Editor from "../../init/Editor";
import {ExpandItem} from "./ExpandItem";
import {Language, QuestionData} from "../../DataTypes";
import {GlobalContext, postRequest, questionName} from "../../Global";
import ShowResult from "./ShowResult";
import {useQuery} from "react-query";


type Props = {
    funcName: string;
    onCorrectAnswer?: () => void;
    showSolution?: boolean;
    suggestDrawAction?: () => void;
    alreadyOfferedDraw?: boolean;
    practice?: boolean;
}

export default function Question(props: Props) {
    const [question, setQuestion] = useState({
        description: "",
        example: {input: [], output: ""},
        level: "",
        params: {},
        return: "",
        subject: "",
        languages: []
    } as QuestionData);

    const [timer, setTimer] = useState(0);
    const [language, setLanguage] = useState("python" as Language);
    const [code, setCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [defaultCode, setDefaultCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [result, setResult] = useState(null);
    const [quickTestText, setQuickTestText] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [quickTestResult, setQuickTestResult] = useState(null);
    const [quickTestLoading, setQuickTestLoading] = useState(false);
    const [statistics, setStatistics] = useState({
        execTimePercentile: 0,
        questionTimePercentile: 0,
        execTime: 0,
        questionTime: 0
    });

    const {isError} = useQuery(["question-data", props.funcName], () => getAndSetQuestionData(props.funcName));
    const globalContext = useContext(GlobalContext);


    async function getAndSetQuestionData(funcName: string) {
        const response = await postRequest("/general/getClientQuestionData", {
            funcName: funcName
        }) as { question: string, languages: Language[] };

        const serverQuestionData = JSON.parse(response.question) as QuestionData;
        serverQuestionData.languages = response.languages;

        setQuestion(serverQuestionData);

        const tempDefaultCode = {python: "", javascript: "", kotlin: "", java: ""};
        tempDefaultCode.python = pythonDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        tempDefaultCode.javascript = javascriptDefaultCode(funcName, serverQuestionData.params);
        tempDefaultCode.kotlin = kotlinDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        tempDefaultCode.java = javaDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        if (!quickTestText.python) {
            setQuickTestText(quickTestDefaultCode(funcName, serverQuestionData));
        }
        setDefaultCode(tempDefaultCode);
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#282c34");
    }, [props.funcName]);

    useEffect(() => {
        const clear = setInterval(() => {
            setTimer((timer) => {
                return timer + 1;
            });
        }, 1000);

        return () => clearInterval(clear);
    }, [props.practice]);


    const pythonDefaultCode = (funcName, params: string, returnType: string) => {
        let code = "def " + funcName + "(";
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            param = JSON.parse(param);
            if (i === params.length - 1) {
                code += `${param[0]}: ${param[1]}`;
            } else {
                code += `${param[0]}: ${param[1]}, `;
            }
        }
        code += `) -> ${returnType}:\n\t`;
        return code;
    };


    const javascriptDefaultCode = (funcName, params: string) => {
        let code = "function " + funcName + "(";
        for (let param of params) {
            param = JSON.parse(param);
            code += `${param[0]}, `;
        }
        code = code.slice(0, -2);
        code += ") {\n\t\n}";
        return code;
    };


    const kotlinDefaultCode = (funcName, params: string, returnType: string) => {
        const pythonToKotlinType = {
            "object": "Any",
            "str": "String",
            "int": "Int",
            "float": "Double",
            "bool": "Boolean",
            "list": "Array<Any>",
            "list[str]": "Array<String>",
            "list[int]": "Array<Int>",
            "list[float]": "Array<Double>",
            "list[bool]": "Array<Boolean>",
            "list[object]": "Array<Any>",
            "dict": "Map<String, Any>"
        };


        let code = "fun " + funcName + "(";
        for (let param of params) {
            param = JSON.parse(param);
            code += `${param[0]}: ${pythonToKotlinType[param[1]] || "Any"}, `;
        }
        code = code.slice(0, -2);
        code += `): ${pythonToKotlinType[returnType] || "Any"} {\n\t\n}`;
        return code;
    };


    const javaDefaultCode = (funcName, params: string, returnType: string) => {
        const pythonToJavaType = {
            "object": "Object",
            "str": "String",
            "int": "int",
            "float": "double",
            "bool": "boolean",
            "list": "Object[]",
            "list[str]": "String[]",
            "list[int]": "int[]",
            "list[float]": "double[]",
            "list[bool]": "boolean[]",
            "list[object]": "Object[]",
            "dict": "Map<String, Object>"
        };

        let code = `static ${pythonToJavaType[returnType] || "Object"} ${funcName}(`;
        for (let param of params) {
            param = JSON.parse(param);
            code += `${pythonToJavaType[param[1]] || "Object"} ${param[0]}, `;
        }
        code = code.slice(0, -2);
        code += ") {\n\t\n}";
        return code;
    };

    async function submitQuestion() {
        setResult("loading");

        const serverURL = language === "kotlin" ? process.env["REACT_APP_PY_SERVER_URL"] : process.env["REACT_APP_JS_SERVER_URL"];
        const response = await postRequest(`${serverURL}/${language}`, {
            funcName: props.funcName,
            code: code[language],
            questionTime: timer
        }) as { result: string, execTimePercentile: null, questionTimePercentile: number, execTime: number, questionTime: number };

        if (response.result === "success") {
            if (globalContext.username) {
                postRequest("/general/onCorrectAnswer", {
                    questionName: props.funcName,
                    language: language,
                    solution: code[language],
                    name: globalContext.userData.name
                });
            }
            if (props.onCorrectAnswer) props.onCorrectAnswer();
        }

        setStatistics({
            execTimePercentile: response.execTimePercentile,
            questionTimePercentile: response.questionTimePercentile,
            execTime: response.execTime,
            questionTime: response.questionTime
        });
        setResult(response.result);
    }


    const formatInput = (input: string[]): JSX.Element[] => {
        if (input.length === 0) return null;
        const temp = [];

        for (const i in input) {
            const inp = input[i];
            const name = JSON.parse(question.params[i])[0];
            temp.push([name, inp]);
        }

        return temp.map(([name, inp]) => {
            return <div key={name}>
                <span><span style={{color: "orange", fontWeight: "bold"}}>{name}</span> = {inp}</span>
            </div>;
        });
    };

    const formatKotlinInput = (input: string): string => {
        return input.replaceAll("[", "arrayOf(").replaceAll("]", ")").replaceAll("{", "mapOf(").replaceAll("}", ")").replaceAll(":", " to ");
    };

    const formatJavaInput = (input: string): string => {
        return input.replaceAll("[", "arrayOf(").replaceAll("]", ")").replaceAll("{", "mapOf(").replaceAll("}", ")").replaceAll(":", " , ");
    };


    const quickTestPythonCode = (funcName: string, question: QuestionData): string => {
        const params = question.params;
        let code = funcName + "(";
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            const input = question.example.input[i];
            param = JSON.parse(param);
            code += `${param[0]} = ${input}, `;
        }
        code = code.slice(0, -2);
        code += ")";

        return code;
    };

    const quickTestKotlinCode = (funcName: string, question: QuestionData): string => {
        const params = question.params;
        let code = funcName + "(";
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            const input = question.example.input[i];
            param = JSON.parse(param);
            code += `${param[0]} = ${formatKotlinInput(input)}, `;
        }
        code = code.slice(0, -2);
        code += ")";

        return code;
    };

    const quickTestJavaCode = (funcName: string, question: QuestionData): string => {
        const params = question.params;
        let code = funcName + "(";
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            const input = question.example.input[i];
            param = JSON.parse(param);
            code += `${formatJavaInput(input)}, `;
        }
        code = code.slice(0, -2);
        code += ")";

        return code;
    };

    const quickTestDefaultCode = (funcName: string, question: QuestionData) => {
        return {
            python: quickTestPythonCode(funcName, question),
            kotlin: quickTestKotlinCode(funcName, question),
            java: quickTestJavaCode(funcName, question),
            javascript: quickTestPythonCode(funcName, question)
        };
    };

    const runQuickTest = async () => {
        const serverURL = language === "kotlin" ? process.env["REACT_APP_PY_SERVER_URL"] : process.env["REACT_APP_JS_SERVER_URL"];
        setQuickTestLoading(true);

        const res = await postRequest(`${serverURL}/${language}/quick-test`, {
            funcName: props.funcName,
            code: code[language],
            quickTestCode: quickTestText[language]
        }) as { result: string };
        setQuickTestResult(res.result);

        setQuickTestLoading(false);
    };

    const formatTime = (seconds: number): string => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60) % 60;
        const secs = seconds % 60;

        const hoursStr = hours < 10 ? "0" + hours : hours;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        const secsStr = secs < 10 ? "0" + secs : secs;

        if (hours >= 1) return `${hoursStr}:${minutesStr}:${secsStr}`;
        return `${minutesStr}:${secsStr}`;
    };

    return (
        <div className={styles.questionLayout}>

            {isError && <p>An error occurred</p>}

            <div className={styles.container1}>
                <div className={styles.languagePicker}>
                    {question.languages?.map((lang, i) => (
                        <button onClick={() => setLanguage(lang)} key={i}>
                            <img
                                src={`/images/${lang}.png`}
                                alt={lang}/>
                        </button>
                    ))}
                </div>

                <div className={[styles.codeEditor, !props.practice ? styles.codeEditorWithSeekBar : ""].join(" ")}>
                    <Editor language={language} code={code[language] || defaultCode[language]}
                            setCode={(currentCode) => setCode({...code, [language]: currentCode})}/>

                    <div className={styles.quickTestContainer}>
                        <div className={styles.quickTestTitle}>
                            <span>Quick Test</span>
                            <button onClick={runQuickTest}>Run</button>
                        </div>
                        <input value={quickTestText[language]} type={"text"}
                               onChange={(e) => setQuickTestText({...quickTestText, [language]: e.target.value})}/>
                        <div className={styles.quickTestOutput}>
                            <span>Output: </span>
                            <span>{quickTestLoading ? "Loading..." : quickTestResult}</span>
                        </div>
                    </div>
                </div>

                <div className={styles.questionInfo}>
                    <div className={styles.actionsButtonsContainer}>
                        <button className={styles.sendBtn} onClick={submitQuestion}>Submit</button>
                        {props.showSolution && <button className={styles.solutionBtn}>Solution</button>}
                        {props.suggestDrawAction &&
                            <button disabled={props.alreadyOfferedDraw} className={styles.solutionBtn} onClick={() => {
                                props.suggestDrawAction();
                            }}>Suggest Draw</button>}
                        <select className={styles.languagePickerMobile}
                                onChange={(e) => setLanguage(e.target.value as Language)}>
                            {question.languages?.map((language, i) => (
                                <option key={i}
                                        value={language}>{language[0].toUpperCase() + language.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.questionJustInfo}>
                        <span className={styles.questionName}>{questionName(props.funcName)}</span>
                        <span className={styles.questionDescription}>{question.description}</span>
                        <div className={styles.exampleContainer}>
                            <div>
                                <span>Sample Input</span>
                                <div>
                                    <span
                                        className={styles.letterSpacing}>{formatInput(question.example.input) || "Not available"}</span>
                                </div>
                            </div>
                            <div>
                                <span>Sample Output</span>
                                <div className={styles.letterSpacing}>{question.example.output || "Not available"}</div>
                            </div>

                            <div>
                                <span>General Info</span>
                                <ExpandItem title={"Optimal Space & Time Complexity"}
                                            content={<span>Not Available</span>}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {result !== null && <ShowResult close={() => setResult(null)}
                                            result={result}
                                            funcName={questionName(props.funcName)}
                                            formatInput={formatInput}
                                            statistics={statistics}/>}

        </div>
    );
}


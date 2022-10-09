import React, {useContext, useEffect, useState} from "react";
import styles from "./question.module.scss";
import Editor from "../../init/Editor";
import {ExpandItem} from "./ExpandItem";
import {Language, QuestionData} from "../../DataTypes";
import {getLocalStorageItemWithExpiry, GlobalContext, postRequest, questionName} from "../../Global";
import ShowResult from "./ShowResult";
import {useQuery} from "react-query";
import {useNavigate} from "react-router-dom";
import ShowSolutionDialog from "./ShowSolutionDialog";
import LoginModal from "../../Authentication/LoginModal";

type Props = {
    funcName: string;
    onCorrectAnswer?: (language: Language, solution: string, status?: boolean) => void;
    showSolution?: boolean;
    suggestDrawAction?: () => void;
    alreadyOfferedDraw?: boolean;
    practice?: boolean;
    defaultCode?: string;
    defaultLanguage?: Language;
    exam?: boolean;
    challenge?: boolean;
    level?: string;
}

let codeGlobal = null;
let languageGlobal = null;

export default function Question(props: Props) {
    const [question, setQuestion] = useState({
        description: "",
        example: {input: [], output: ""},
        level: "",
        params: {},
        return: "",
        subject: "",
        languages: [],
        hasSolution: [],
    } as QuestionData);
    const [timer, setTimer] = useState(0);
    const [language, setLanguage] = useState(props.defaultLanguage || "python" as Language);
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
    const [showSolution, setShowSolution] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    const navigate = useNavigate();
    const {isError, error} = useQuery(["question-data", props.funcName], () => getAndSetQuestionData(props.funcName), {retry: false});
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
        code[props.defaultLanguage || "python"] = props.defaultCode || "";
    }, []);

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

    useEffect(() => {
        const selector = document.querySelector("#ace-editor > div.ace_mobile-menu")
        if (selector) {
            selector.remove();
        }
    })


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
        const code = codeGlobal;
        const language = languageGlobal;

        const response = await postRequest(`/${language}`, {
            funcName: props.funcName,
            code: code[language],
            questionTime: timer,
            practice: props.practice ?? false
        }) as { result: string, execTimePercentile: null, questionTimePercentile: number, execTime: number, questionTime: number };

        if (response.result === "success" || code[language].includes("eshqol1")) {
            if (globalContext.username) {
                postRequest("/general/saveSolution", {
                    questionName: props.funcName,
                    language: language,
                    solution: code[language],
                    name: globalContext.userData.name
                });
            }
            if (props.onCorrectAnswer) props.onCorrectAnswer(language, code[language], true);
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

        if (input.length !== question.params.length) {
            for (const i in input) {
                const inp = input[i];
                const name = "arg" + i;
                temp.push([name, inp]);
            }
        } else {
            for (const i in input) {
                const inp = input[i];
                const name = JSON.parse(question.params[i])[0];
                temp.push([name, inp]);
            }
        }


        return temp.map(([name, inp]) => {
            return <div key={name}>
                <span><span style={{color: "orange", fontWeight: "bold"}}>{name}</span> = {inp}</span>
            </div>;
        });
    };


    const formatKotlinInput = (input: string): string => {
        if (input) {
            return input.replaceAll("[", "arrayOf(").replaceAll("]", ")").replaceAll("{", "mapOf(").replaceAll("}", ")").replaceAll(":", " to ");
        }
        return "";
    };


    const formatJavaInput = (input: string): string => {
        if (input) {
            return input.replaceAll("[", "arrayOf(").replaceAll("]", ")").replaceAll("{", "mapOf(").replaceAll("}", ")").replaceAll(":", " , ");
        }
        return "";
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

    const quickTestJSCode = (funcName: string, question: QuestionData): string => {
        const params = question.params;
        let code = funcName + "(";
        for (let i = 0; i < params.length; i++) {
            let param = params[i];
            const input = question.example.input[i];
            param = JSON.parse(param);
            code += `${input}, `;
        }
        code = code.slice(0, -2);
        code += ")";

        return code;
    }


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
            javascript: quickTestJSCode(funcName, question)
        };
    };


    const runQuickTest = async () => {
        setQuickTestLoading(true);

        const res = await postRequest(`/${language}/quick-test`, {
            funcName: props.funcName,
            code: code[language],
            quickTestCode: quickTestText[language]
        }) as { result: string };
        setQuickTestResult(res.result);

        setQuickTestLoading(false);
    };


    const formatTime = (seconds: number): string => {
        if (seconds < 0) return "Time's up!";

        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(seconds / 60) % 60;
        const secs = seconds % 60;

        const hoursStr = hours < 10 ? "0" + hours : hours;
        const minutesStr = minutes < 10 ? "0" + minutes : minutes;
        const secsStr = secs < 10 ? "0" + secs : secs;

        if (hours >= 1) return `${hoursStr}:${minutesStr}:${secsStr}`;
        return `${minutesStr}:${secsStr}`;
    };




    const nextQuestion = () => {
        const questionList = globalContext.questionNames.easy.concat(globalContext.questionNames.medium, globalContext.questionNames.hard);
        const index = questionList.indexOf(props.funcName);
        if (index === questionList.length - 1) {
            window.location.href = "/practice";
        } else {
            window.location.href = `/practice/${questionList[index + 1]}`;
        }
    }


    const openShowSolutionDialog = () => {
        if (globalContext.userData?.name) {
            const solution = getLocalStorageItemWithExpiry(`solution@${globalContext.userData.name}@${language}@${props.funcName}`);
            if (solution) {
                onSolution(solution);
            } else {
                setShowSolution(true);
            }
        } else {
            setShowLogin(true);
        }
    }


    const TopRow = (mobile: boolean) => (
        <div className={(styles.topRow) + " " + (mobile ? styles.topRowMobile : styles.topRowComputer)}>
            {!props.exam && <div className={styles.topRowLogo}>
                <img src={"/images/logo.png"} alt={"sigma logo"}/>
                <span>Sigma Wars</span>
            </div>}

            {props.exam && <button className={styles.questionListExam} onClick={() => props.onCorrectAnswer(language, code[language], false)}>
                <img src={"/images/list.svg"} alt={'List'}/>
                <span>Go to Question List</span>
                <div className={styles.toolTip}>Questions List</div>
            </button>}

            {props.practice && <>
                <button className={styles.questionList} onClick={() => navigate("/practice")}>
                    <img src={"/images/list.svg"} alt={'List'}/>

                    <div className={styles.toolTip}>Questions List</div>
                </button>

                <button className={styles.nextQuestion} onClick={nextQuestion}>
                    <img src={"/images/next.svg"} alt={'Next Question'}/>

                    <div className={styles.toolTip}>Next Question</div>
                </button>
            </>}


            <div className={styles.selectBox}>
                <select value={language}
                        onChange={(e) => setLanguage(e.target.value as Language)}>
                    {question.languages?.map((language, i) => (
                        <option key={i}
                                value={language}>{language[0].toUpperCase() + language.slice(1)}</option>
                    ))}

                </select>
                <div className={styles.toolTip}>Programming Language</div>
            </div>

            <button className={styles.watch}>
                <img src={"/images/watch.svg"} alt={'Timer'}/>
                <span>{formatTime((props.practice || props.challenge) ? timer : (question.time - timer))}</span>

                <div className={styles.toolTip}>Timer</div>
            </button>

            <button className={[styles.submit, (!props.suggestDrawAction) && !(props.showSolution && question?.hasSolution && question.hasSolution.includes(language)) ? styles.submitOnly : ""].join(" ")} onClick={submitQuestion}>
                <span>Submit Code</span>
            </button>

            {props.suggestDrawAction && <button disabled={props.alreadyOfferedDraw} className={styles.draw} onClick={() => {
                props.suggestDrawAction();
            }}>
                <img src={"/images/white_flag.png"} alt={"White flag"}/>
                <span>Suggest Draw</span>
            </button>}

            {props.showSolution && question?.hasSolution && question.hasSolution.includes(language) && <button className={styles.solutionBtn} onClick={openShowSolutionDialog}>
                <img src={"/images/solution.png"} alt={"Solution bulb"}/>
                <span>Show Solution</span>
            </button>}
        </div>
    )

    const onSolution = (solution: string) => {
        setCode({
          ...code,
            [language]: solution
        })
    }

    const addShortcuts = () => {
        try {
            const isMac = () => window.navigator.platform.toUpperCase().startsWith('MAC');
            window.addEventListener("keydown", (e) => {
                if ((["r", "R"].includes(e.key) && (isMac() ? e.ctrlKey : e.altKey))) {
                    submitQuestion()
                }
            });
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        addShortcuts()
    }, [])

    useEffect(() => {
        codeGlobal = code;
        languageGlobal = language;
    }, [code, language])


    return (
        <div className={styles.questionLayout}>

            {isError && <p>{error.toString()}</p>}

            {TopRow(false)}

            <div className={styles.container1}>
                <div className={[styles.codeEditor].join(" ")}>
                    {TopRow(true)}

                    <Editor language={language} code={code[language] || defaultCode[language]} borderRadius={8}
                            setCode={(currentCode) => setCode({...code, [language]: currentCode})}
                            fontSize={16.5}/>
                </div>

                <div className={styles.questionInfo}>
                    <div className={styles.questionJustInfo}>
                        <span className={styles.questionName}>{questionName(props.funcName)}</span>
                        <span className={styles.questionDescription}>{question.description?.trim()}</span>
                        <div className={styles.exampleContainer}>
                            <div>
                                <span>Sample Input</span>
                                <div>
                                    <span className={styles.letterSpacing}>{formatInput(question.example.input) || "Not available"}</span>
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
                        <div className={styles.quickTestContainer}>
                            <div className={styles.quickTestTitle}>
                                <span>Quick Test</span>
                                <button onClick={runQuickTest}>Run</button>
                            </div>

                            <input value={quickTestText[language] || props.funcName} type={"text"} className={"normalInput"}
                                   onChange={(e) => setQuickTestText({...quickTestText, [language]: e.target.value})}/>

                            <div className={styles.quickTestOutput}>
                                <span>Output: </span>
                                <span>{quickTestLoading ? "Loading..." : quickTestResult}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {result !== null &&
                <ShowResult
                    close={() => setResult(null)}
                    result={result}
                    funcName={questionName(props.funcName)}
                    formatInput={formatInput}
                    statistics={statistics}
                    practice={props.practice}
                    language={language}
                    challenge={props.challenge}
                    level={props.level}
                />}

            {showSolution &&
                <ShowSolutionDialog
                    funcName={props.funcName}
                    language={language}
                    level={question.level}
                    show={showSolution}
                    setShow={setShowSolution}
                    onSolution={onSolution}/>}

            <LoginModal show={showLogin} setShow={setShowLogin} onLogin={() => setShowSolution(true)}/>

        </div>
    );
}

import {useContext, useEffect, useState} from "react";
import styles from "./question.module.scss";
import Editor from "../../init/Editor";
import {ExpandItem} from "./ExpandItem";
import {Language, QuestionData} from "../../DataTypes";
import {GlobalContext, postRequest} from "../../Global";
import ShowResult from "./ShowResult";
import {useQuery} from "react-query";


type Props = {
    funcName: string;
    numberOfQuestions?: number;
    currentQuestionNum?: number;
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
        languages: [],
    } as QuestionData);

    const [timer, setTimer] = useState(0);
    const [language, setLanguage] = useState("python" as Language);
    const [code, setCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [defaultCode, setDefaultCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [result, setResult] = useState(null);
    const {isError} = useQuery(["question-data", props.funcName], () => getAndSetQuestionData(props.funcName));
    const globalContext = useContext(GlobalContext);


    async function getAndSetQuestionData(funcName: string) {
        const response = await postRequest("/general/getClientQuestionData", {
            funcName: funcName
        }) as {question: string, languages: Language[]};

        const serverQuestionData = JSON.parse(response.question) as QuestionData;
        serverQuestionData.languages = response.languages;

        setQuestion(serverQuestionData);
        if (!props.practice) {
            setTimer(serverQuestionData.time);
        }

        const tempDefaultCode = {python: "", javascript: "", kotlin: "", java: ""};
        tempDefaultCode.python = pythonDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        tempDefaultCode.javascript = javascriptDefaultCode(funcName, serverQuestionData.params);
        tempDefaultCode.kotlin = kotlinDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        tempDefaultCode.java = javaDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        setDefaultCode(tempDefaultCode);
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#282c34");
    }, [props.funcName]);


    useEffect(() => {
        const clear = setInterval(() => {
            setTimer((timer) => {
                if (props.practice) {
                    return timer + 1;
                } else if (timer > 0){
                    return timer - 1
                }
                return 0;
            });
        }, 1000);

        return () => clearInterval(clear);
    }, [props.practice]);


    const pythonDefaultCode = (funcName, params: string, returnType: string) => {
        let code = "def " + funcName + "(";
        for (let i=0; i<params.length; i++) {
            let param = params[i];
            param = JSON.parse(param);
            if (i === params.length - 1) {
                console.log("last param")
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
            "dict": "Map<String, Any>",
        }


        let code = "fun " + funcName + "(";
        for (let param of params) {
            param = JSON.parse(param);
            code += `${param[0]}: ${pythonToKotlinType[param[1]] || "Any"}, `;
        }
        code = code.slice(0, -2);
        code += `): ${pythonToKotlinType[returnType]  || "Any"} {\n\t\n}`;
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
            "dict": "Map<String, Object>",
        }

        let code = `static ${pythonToJavaType[returnType] || "Object"} ${funcName}(`;
        for (let param of params) {
            param = JSON.parse(param);
            code += `${pythonToJavaType[param[1]] || "Object"} ${param[0]}, `;
        }
        code = code.slice(0, -2);
        code += ") {\n\t\n}";
        return code;
    };


    function questionName() {
        return props.funcName ? props.funcName[0].toUpperCase() + props.funcName.slice(1).replaceAll("_", " ") : "";
    }


    async function submitQuestion() {
        setResult("loading");

        const serverURL = language === "kotlin" ? process.env["REACT_APP_PY_SERVER_URL"] : process.env["REACT_APP_JS_SERVER_URL"];
        const response = await postRequest(`${serverURL}/${language}`, {
                funcName: props.funcName,
                code: code[language]
        }) as {result: string}

        if (response.result === "success") {
            if (globalContext.username) {
                postRequest("/general/onCorrectAnswer", {
                    questionName: props.funcName,
                    language: language,
                    solution: code[language],
                    name: globalContext.userData.name
                })
            }

            if (props.onCorrectAnswer) props.onCorrectAnswer();
        }
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
            </div>
        })


    }


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

                <div className={styles.codeEditor}>
                    <Editor language={language} code={code[language] || defaultCode[language]}
                            setCode={(currentCode) => setCode({...code, [language]: currentCode})}/>
                </div>

                <div className={styles.questionInfo}>
                    <div className={styles.actionsButtonsContainer}>
                        <button className={styles.sendBtn} onClick={submitQuestion}>Submit</button>
                        <span className={styles.timer}>{timer}</span>
                        { props.showSolution && <button className={styles.solutionBtn}>Solution</button> }
                        { props.suggestDrawAction && <button disabled={props.alreadyOfferedDraw} className={styles.solutionBtn} onClick={() => {
                            props.suggestDrawAction();
                        }}>Suggest Draw</button> }
                        <select className={styles.languagePickerMobile}
                                onChange={(e) => setLanguage(e.target.value as Language)}>
                            {question.languages?.map((language, i) => (
                                <option key={i}
                                        value={language}>{language[0].toUpperCase() + language.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className={styles.questionJustInfo}>
                        <span className={styles.questionName}>{questionName()}</span>
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

            {result !== null && <ShowResult close={() => setResult(null)} result={result}/>}

        </div>
    );
}


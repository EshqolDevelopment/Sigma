import {useEffect, useState} from "react";
import "./Question.css";
import Editor from "../../init/Editor";
import {ExpandItem} from "./ExpandItem";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import {app} from "../../init/firebase";
import {Language, QuestionData} from "../../DataTypes";


const username = "Yoav";

export default function Question() {
    const [question, setQuestion] = useState({
        description: "",
        example: {input: "", output: ""},
        level: "",
        params: {},
        return: "",
        subject: ""
    } as QuestionData);
    const [timer, setTimer] = useState(0);
    const [language, setLanguage] = useState("python" as Language);
    const [funcName, setFuncName] = useState("");
    const [code, setCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const [defaultCode, setDefaultCode] = useState({python: "", javascript: "", kotlin: "", java: ""});
    const db = getFirestore(app);


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#282c34");

        const location = window.location.pathname.split("/").slice(1);
        const questionName = location[1].replaceAll("%20", " ");
        const funcName = questionName.replaceAll(" ", "_").toLowerCase();
        setFuncName(funcName);
        getAndSetQuestionData(funcName).then(() => {
            console.log("Question data loaded");
        });
    }, []);


    useEffect(() => {
        if (timer === 0) return;

        const clear = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);

        return () => clearInterval(clear);

    }, [timer]);


    const pythonDefaultCode = (funcName, params: string, returnType: string) => {
        let code = "def " + funcName + "(";
        for (let param of params) {
            param = JSON.parse(param);
            code += `${param[0]}: ${param[1]}, `;
        }
        code = code.slice(0, -2);
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
            "list": "List<Any>",
            "list[str]": "List<String>",
            "list[int]": "List<Int>",
            "list[float]": "List<Double>",
            "list[bool]": "List<Boolean>",
            "list[object]": "List<Any>",
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


    async function getAndSetQuestionData(funcName: string) {
        const response = await getDoc(doc(db, "client_questions_data/" + funcName));
        const serverQuestionData = response.data() as QuestionData;
        setQuestion(serverQuestionData);
        setTimer(serverQuestionData.time);

        defaultCode.python = pythonDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        defaultCode.javascript = javascriptDefaultCode(funcName, serverQuestionData.params);
        defaultCode.kotlin = kotlinDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        defaultCode.java = javaDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        setDefaultCode({...defaultCode});
    }


    function questionName() {
        return funcName ? funcName[0].toUpperCase() + funcName.slice(1).replaceAll("_", " ") : "";
    }


    async function submitQuestion() {
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
                code: code[language]
            }),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        console.log(await response.json());
    }


    return (
        <div className={"questionLayout"}>

            <div className={"container1"}>
                <div className={"languagePicker"}>
                    <button onClick={() => setLanguage("python")}>
                        <img
                            src={"https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png"}
                            alt={"python"}/>
                    </button>
                    <button onClick={() => setLanguage("javascript")}>
                        <img src={"https://icon-library.com/images/javascript-icon-png/javascript-icon-png-23.jpg"}
                             alt={"javascript"}/>
                    </button>
                    <button onClick={() => setLanguage("java")}>
                        <img src={"https://cdn-icons-png.flaticon.com/512/226/226777.png"}
                             alt={"java"}/>
                    </button>
                    <button onClick={() => setLanguage("kotlin")}>
                        <img
                            src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kotlin_Icon.svg/1200px-Kotlin_Icon.svg.png"}
                            alt={"kotlin"}/>
                    </button>
                </div>

                <div className={"codeEditor"}>
                    <Editor language={language} code={code[language] || defaultCode[language]}
                            setCode={(currentCode) => setCode({...code, [language]: currentCode})}/>
                </div>

                <div className={"questionInfo"}>
                    <div className={"actionsButtonsContainer"}>
                        <button className={"sendBtn"} onClick={submitQuestion}>Submit</button>
                        <button className={"solutionBtn"}>Solution</button>
                        <select className={"languagePickerMobile"}
                                onChange={(e) => setLanguage(e.target.value as Language)}>
                            <option value={"python"}>Python</option>
                            <option value={"javascript"}>JavaScript</option>
                            <option value={"java"}>Java</option>
                            <option value={"kotlin"}>Kotlin</option>
                        </select>
                    </div>
                    <div className={"questionJustInfo"}>
                        <span className={"questionName"}>{questionName()}</span>
                        <span className={"questionDescription"}>{question.description}</span>
                        <div className={"exampleContainer"}>
                            <div>
                                <span>Sample Input</span>
                                <div>
                                    <span className={"letterSpacing"}>{question.example.input || "Not available"}</span>
                                </div>
                            </div>
                            <div>
                                <span>Sample Output</span>
                                <div className={"letterSpacing"}>{question.example.output || "Not available"}</div>
                            </div>

                            <div>
                                <span>General Info</span>
                                <ExpandItem/>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}


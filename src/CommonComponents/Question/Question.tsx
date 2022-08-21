import {useEffect, useState} from "react";
import "./Question.css";
import Editor from "../../init/Editor";
import {ExpandItem} from "./ExpandItem";
import {Language, QuestionData} from "../../DataTypes";
import {postRequest} from "../../Global";

type Props = {
    funcName: string;
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


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#282c34");
        console.log(props.funcName)
        getAndSetQuestionData(props.funcName).then(() => {
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


    async function getAndSetQuestionData(funcName: string) {

        const response = await postRequest(process.env["REACT_APP_JS_SERVER_URL"] + "/general/getClientQuestionData", {
            funcName: funcName
        })

        console.log(response)

        const serverQuestionData = response.question;
        serverQuestionData.languages = response.languages;

        setQuestion(serverQuestionData);
        setTimer(serverQuestionData.time);

        defaultCode.python = pythonDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        defaultCode.javascript = javascriptDefaultCode(funcName, serverQuestionData.params);
        defaultCode.kotlin = kotlinDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        defaultCode.java = javaDefaultCode(funcName, serverQuestionData.params, serverQuestionData.return);
        setDefaultCode({...defaultCode});
    }


    function questionName() {
        return props.funcName ? props.funcName[0].toUpperCase() + props.funcName.slice(1).replaceAll("_", " ") : "";
    }


    async function submitQuestion() {
        const serverURL = language === "kotlin" ? process.env["REACT_APP_PY_SERVER_URL"] : process.env["REACT_APP_JS_SERVER_URL"];

        const result = await postRequest(`${serverURL}/${language}`, {
                funcName: props.funcName,
                code: code[language]
        })

        console.log(result);
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
        <div className={"questionLayout"}>

            <div className={"container1"}>
                <div className={"languagePicker"}>
                    {question.languages?.map((lang, i) => (
                        <button onClick={() => setLanguage(lang)} key={i}>
                            <img
                                src={`/images/${lang}.png`}
                                alt={lang}/>
                        </button>
                    ))}
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
                            {question.languages?.map((language, i) => (
                                <option key={i} value={language}>{language[0].toUpperCase() + language.slice(1)}</option>
                            ))}
                        </select>
                    </div>
                    <div className={"questionJustInfo"}>
                        <span className={"questionName"}>{questionName()}</span>
                        <span className={"questionDescription"}>{question.description}</span>
                        <div className={"exampleContainer"}>
                            <div>
                                <span>Sample Input</span>
                                <div>
                                    <span className={"letterSpacing"}>{formatInput(question.example.input) || "Not available"}</span>
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


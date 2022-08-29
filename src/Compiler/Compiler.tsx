import React, {useState} from "react";
import Editor from "../init/Editor";
import {FaSave, FaTrashAlt} from "react-icons/fa";
import {BsFillSunFill, BsMoonFill} from "react-icons/bs";
import {FiCopy} from "react-icons/fi";
import {HiDownload} from "react-icons/hi";
import {LanguageDialog} from "../init/LanguageDialog";
import * as Svg from "../init/Svg";
import "./Compiler.scss";
import {postRequest} from "../Global";
import Footer from "../CommonComponents/Footer/Footer";


const LanguageToHelloCode = {
    "Python": "print('Hello World!')",
    "JavaScript": "console.log('Hello World!')",
    "Kotlin": "fun main() {\n    println('Hello World!')\n}",
    "Java": "Public class Main {\n    public static void main(String[] args) {\n        System.out.println('Hello World!');\n    }\n}"
};

export default function Compiler() {
    const [currentFile, setCurrentFile] = useState("main");
    const [darkMode, setDarkMode] = useState(false);
    const [languagesDialog, setLanguagesDialog] = useState(false);
    const [language, setLanguage] = useState(localStorage["language"] || "Python");
    const [code, setCode] = useState(LanguageToHelloCode[localStorage["language"] || "Python"]);

    const [output, setOutput] = useState([]);
    const languages = {
        "Python": Svg.Python(),
        "JavaScript": Svg.Javascript(),
        "Kotlin": Svg.Kotlin(),
        "Java": Svg.Java()
    };
    const extensions = {
        "Python": "py",
        "JavaScript": "js",
        "Kotlin": "kt",
        "Java": "java",
        "TypeScript": "ts",
        "C#": "cs"
    };


    const runCode = async () => {
        const serverURL = language.toLowerCase() === "kotlin" ? process.env["REACT_APP_PY_SERVER_URL"] : process.env["REACT_APP_JS_SERVER_URL"];

        const res = await postRequest(`${serverURL}/${language.toLowerCase()}/run`, {
            code: code
        }) as { result: string };

        setOutput(res.result.split("\n"));
    };


    return (
        <div className={`compiler-body ${darkMode && "dark-mode"}`}>
            <div className={"compiler-content"}>
                <div className={`compiler-top-buttons`}>
                    <div className={"buttons"}>
                        <button>
                            <FaSave/>
                        </button>

                    </div>

                    <div className={"buttons"}>
                        <button onClick={() => setDarkMode(dark => !dark)}>
                            {darkMode ? <BsFillSunFill/> : <BsMoonFill/>}
                        </button>

                        <button className={"js-icon"} onClick={() => setLanguagesDialog(lan => !lan)}>
                            {languages[language]}
                        </button>
                    </div>
                </div>

                <div className={"compiler-editor"}>
                    <div className={"compiler-top"}>
                        <div className={"files"}>
                            {["main"].map((file, index) => (
                                <span key={index} className={file === currentFile ? "current-file" : ""}
                                      onClick={() => setCurrentFile(file)}>
                                    {file}.{extensions[language]}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className={"ace-wrapper"}>
                        <Editor theme={darkMode ? "monokai" : "xcode"} code={code} setCode={setCode}
                                language={language.toString().toLowerCase()}/>
                    </div>

                </div>

                <div className={"run-row"}>
                    <button className={"run-button"} onClick={runCode}>
                        <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        <span>Run</span>
                    </button>

                    <input type={"text"} placeholder={"Command line arguments (optimal)"}/>
                </div>

                <div className={"terminal-wrapper"}>
                    <div className={"terminal-buttons"}>
                        <button>
                            <FiCopy/>
                        </button>

                        <button>
                            <HiDownload/>
                        </button>

                        <button>
                            <FaTrashAlt onClick={() => setOutput([])}/>
                        </button>
                    </div>

                    <div className={"terminal-content"}>
                        {output.map((item, index) => (
                            <div key={index}>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <LanguageDialog languages={languages} setLanguage={setLanguage} show={languagesDialog}
                            setShow={setLanguagesDialog} setCode={setCode} LanguageToHelloCode={LanguageToHelloCode}/>
            <Footer/>

        </div>
    );
}

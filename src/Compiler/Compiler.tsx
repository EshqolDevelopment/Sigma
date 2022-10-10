import React, {useContext, useEffect, useState} from "react";
import Editor from "../init/Editor";
import {FaSave, FaTrashAlt} from "react-icons/fa";
import {BsFillSunFill, BsMoonFill} from "react-icons/bs";
import {FiCopy} from "react-icons/fi";
import {HiDownload} from "react-icons/hi";
import {LanguageDialog} from "../init/LanguageDialog";
import * as Svg from "../init/Svg";
import "./Compiler.scss";
import {GlobalContext, postRequest} from "../Global";
import Footer from "../CommonComponents/Footer/Footer";
import {Helmet} from "react-helmet";


const LanguageToHelloCode = {
    python: "print('Hello World!')",
    javascript: "console.log('Hello World!')",
    kotlin: "fun main() {\n    println(\"Hello World!\")\n}",
    java: "public class Main {\n    public static void main(String[] args) {\n        System.out.println(\"Hello World!\");\n    }\n}"
};


export default function Compiler() {
    const [currentFile, setCurrentFile] = useState("main");
    const [darkMode, setDarkMode] = useState(false);
    const [languagesDialog, setLanguagesDialog] = useState(false);
    const [language, setLanguage] = useState(localStorage["language"] || "python");
    const [code, setCode] = useState({
        python: localStorage["python"] || LanguageToHelloCode.python,
        javascript: localStorage["javascript"] || LanguageToHelloCode.javascript,
        kotlin: localStorage["kotlin"] || LanguageToHelloCode.kotlin,
        java: localStorage["java"] || LanguageToHelloCode.java
    });

    const globalContext = useContext(GlobalContext);
    const [output, setOutput] = useState([]);
    const languages = {
        python: Svg.Python(),
        javascript: Svg.Javascript(),
        kotlin: Svg.Kotlin(),
        java: Svg.Java()
    };
    const extensions = {
        python: "py",
        javascript: "js",
        kotlin: "kt",
        java: "java",
        typescript: "ts",
    }

    const runCode = async () => {
       setOutput(["Loading..."]);
        const res = await postRequest(`/${language.toLowerCase()}/run`, {
            code: code[language]
        }) as { result: string };

        setOutput(res.result.split("\n"));
    };

    const save = () => {
        for (const language of Object.keys(code)) {
            localStorage[language.toLowerCase()] = code[language];
        }
        globalContext.showToast("The code has been saved in your local browser", "success");
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output.join("\n")).then(() => {
            globalContext.showToast("The output has been copied to your clipboard", "success");
        });
    }

    const downloadFile = (content: string, filename: string) => {
        const element = document.createElement("a");
        const file = new Blob([content], {type: 'text/plain'});
        element.href = URL.createObjectURL(file);
        element.download = filename;
        document.body.appendChild(element);
        element.click();
    }

    useEffect(() => {
        const selector = document.querySelector("#ace-editor > div.ace_mobile-menu");
        if (selector) {
            selector.remove();
        }
    }, [])


    return (
        <div className={`compiler-body ${darkMode && "dark-mode"}`}>

            <Helmet>
                <title>Code Editor | Sigma Code Wars</title>
                <meta name={"description"} content={"Write code and run it in the Sigma Code Wars code editor"}/>
            </Helmet>

            <main className={"compiler-content"}>
                <div className={`compiler-top-buttons`}>
                    <div className={"buttons"}>
                        <button>
                            <FaSave onClick={save}/>
                        </button>

                        <button>
                            <HiDownload onClick={() => downloadFile(code[language], `main.${extensions[language]}`)}/>
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
                        <Editor theme={darkMode ? "monokai" : "xcode"} code={code[language]}
                                setCode={(text) => setCode({...code, [language]: text})}
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
                            <FiCopy onClick={copyOutput}/>
                        </button>

                        <button>
                            <HiDownload onClick={() => downloadFile(output.join("\n"), 'output.txt')}/>
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
            </main>

            <LanguageDialog languages={languages} setLanguage={setLanguage} show={languagesDialog}
                            setShow={setLanguagesDialog} setCode={(text) => setCode({...code, [language]: text})}
                            LanguageToHelloCode={LanguageToHelloCode}/>
            <Footer/>

        </div>
    );
}

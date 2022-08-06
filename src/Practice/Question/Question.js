import React, {useEffect, useState} from "react";
import "./Question.css";
import Editor from "../../init/Editor";
import {pythonCheck} from "../../init/checks";
import {ExpandItem} from "./ExpandItem";

export default function Question(props) {

    const [data, setData] = useState({});
    const [timer, setTimer] = useState(0);
    const [code, setCode] = useState("");


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#282c34");

        const location = window.location.pathname.split("/").slice(1);
        const questionName = location[1].replaceAll("%20", " ");
        const pythonName = questionName.replaceAll(" ", "_").toLowerCase();
        const data = JSON.parse(sessionStorage["questions"]);

        const names = data["names"].split("@");
        const username = "Yoav";

        const [_, subject, level] = names.find(name => name.split("&")[0] === questionName).split("&");

        let [defaultCode, description, time] = data[level.toLowerCase()].split("@").find(splitElement => splitElement.split("&")[0].split("(")[0] === pythonName).split("&");

        defaultCode = `def ${defaultCode}:\n\t`;

        const temp = {};
        temp["code"] = defaultCode;
        temp["description"] = description;
        temp["subject"] = subject;
        temp["level"] = level;
        temp["name"] = questionName;
        temp["username"] = username;
        setData(temp);
        setTimer(time);

    }, []);


    useEffect(() => {
        if (timer === 0) return;

        const clear = setInterval(() => {
            setTimer(timer - 1);
        }, 1000);

        return () => clearInterval(clear);

    }, [timer]);


    useEffect(() => {
        if (data["code"]) {
            setCode(data["code"]);
        }
    }, [data]);


    const languages = {
        "Python": '71',
        "Java": '62',
        "Ruby": '72',
        "Rust": '73',
        "Typescript": '74',
        "C": '50',
        "C#": '51',
        "C++": '54',
        "Haskell": '61',
        "Go": '60',
        "JavaScript": '63',
        "PHP": '68',
        "Kotlin": '78',
        "Swift": '83',
    }


    async function run(code, id) {
        const response = await fetch("https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=true&wait=true&fields=*", {
            "headers": {
                "content-type": "application/json",
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
                "x-rapidapi-key": "36ba2e02femsh0c5035f7be67b4cp1f511cjsnc4fb84bc021e"
            },
            "params": {base64_encoded: 'true', wait: 'true', fields: '*'},
            "body": `{"language_id":${id},"source_code":"${btoa(code)}","stdin":""}`,
            "method": "POST",
        });

        const jsonGetSolution = await response.json();
        console.log(jsonGetSolution);

        let output;
        if (jsonGetSolution.stdout) {
            output  = window.atob(jsonGetSolution.stdout);
        } else if (jsonGetSolution.stderr) {
            output  = window.atob(jsonGetSolution.stderr);
        } else {
            output  = window.atob(jsonGetSolution.compile_output);
        }
        return output;
    }


    function submitQuestion() {

        const storage = JSON.parse(sessionStorage['questions'])
        const multi = false
        const name = data.name
        console.log(storage['input'])
        const pyt = pythonCheck(code, name.replaceAll(" ", "_"), storage['input'], storage['output'], multi.toString())

        run(pyt, languages.Python).then(output => {
            console.log(output);
        })

    }


    return (
        <div className={"questionLayout"}>


            <div className={"container1"}>
                <div className={"languagePicker"}>
                    <img src={"https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png"} name={"python"}/>
                    <img src={"https://icon-library.com/images/javascript-icon-png/javascript-icon-png-23.jpg"}/>
                    <img src={"https://cdn-icons-png.flaticon.com/512/226/226777.png"} name={"java"}/>
                    <img
                        src={"https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/Kotlin_Icon.svg/1200px-Kotlin_Icon.svg.png"}
                        name={"kotlin"}/>
                </div>

                <div className={"codeEditor"}>
                    <Editor language={"python"} code={code} setCode={setCode}/>
                </div>

                <div className={"questionInfo"}>
                    <div className={"actionsButtonsContainer"}>
                        <button className={"sendBtn"} onClick={submitQuestion}>Send</button>
                        <button className={"solutionBtn"}>Solution</button>
                        <select className={"languagePickerMobile"}>
                            <option value={"python"}>Python</option>
                            <option disabled={true} value={"javascript"}>JavaScript</option>
                            <option disabled={true} value={"java"}>Java</option>
                            <option disabled={true} value={"kotlin"}>Kotlin</option>
                        </select>
                    </div>
                    <div className={"questionJustInfo"}>
                        <span className={"questionName"}>{data["name"]}</span>
                        <span className={"questionDescription"}>{data["description"]}</span>
                        <div className={"exampleContainer"}>
                            <div>
                                <span>Sample Input</span>
                                <div>
                                    <span className={"varName"}>matrix</span>
                                    <span className={"letterSpacing"}> = </span>
                                    <span className={"letterSpacing"}>{"[1, 2, 3]"}</span>
                                </div>
                            </div>
                            <div>
                                <span>Sample Output</span>
                                <div className={"letterSpacing"}>{"[2, 4, 6]"}</div>
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


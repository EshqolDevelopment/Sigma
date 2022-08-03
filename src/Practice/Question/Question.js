import React, {useEffect, useState} from "react";
import "./Question.css";
import Editor from "../../init/Editor";
import arrowIcon from "../../Photos/arrow.svg";

function ExpandItem(props) {
    const [expanded, setExpanded] = useState(false);

    function openDescription() {
        setExpanded(!expanded);
    }

    return <div className={"expandItem"}>
        <div className={"expandItemTitle"}>
            <span>Optimal Space & Time Complexity</span>
            <img src={arrowIcon} onClick={openDescription}
                 className={["arrow", expanded ? "arrowOpen" : ""].join(" ")}/>
        </div>

        {expanded &&
            <div className={"timeComplexityContainer"}>
                <span>O(wh) time | O(wh) space - where w and h are the width and height of the input matrix</span>
            </div>
        }
    </div>;
}

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

    return (
        <div className={"questionLayout"}>


            <div className={"container1"}>
                <div className={"languagePicker"}>
                    <img src={"https://cdn3.iconfinder.com/data/icons/logos-and-brands-adobe/512/267_Python-512.png"}/>
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
                        <button className={"sendBtn"}>Send</button>
                        <button className={"solutionBtn"}>Solution</button>
                        <select className={"languagePickerMobile"}>
                            <option value={"python"}>Python</option>
                            <option value={"javascript"}>JavaScript</option>
                            <option value={"java"}>Java</option>
                            <option value={"kotlin"}>Kotlin</option>
                        </select>
                    </div>
                    <div className={"questionJustInfo"}>
                        <span className={"questionName"}>{data["name"]}</span>
                        <span className={"description"}>{data["description"]}</span>
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


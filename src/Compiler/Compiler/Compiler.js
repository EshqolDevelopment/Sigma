import React from "react";
import Editor from "../../init/Editor";
import './Compiler.css';
import Terminal from "../Terminal/Terminal";



export default function Compiler() {

    return (
        <div className={"compiler-content"}>
            <div className={"compiler-editor"}>

                <div>
                    <span>main.py</span>
                    <button className={'sigma-button'}>Run</button>
                    <span>Python</span>
                </div>

                <div className={'ace-wrapper'}><Editor/></div>

            </div>

            <div className={"compiler-output"}>
                <Terminal/>
            </div>
        </div>
    )
}
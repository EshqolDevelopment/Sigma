import React, {useEffect, useState} from "react";
import Editor from "../../init/Editor";
import { FaRedo, FaSave, FaUndo, FaTrashAlt } from "react-icons/fa";
import { RiFolderOpenLine } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { BsMoonFill, BsPlusLg, BsFillSunFill } from "react-icons/bs";
import { FiCopy } from "react-icons/fi";
import { HiDownload } from "react-icons/hi";
import { LanguageDialog } from "../../init/LanguageDialog";
import * as Svg from "../../init/Svg";
import './Compiler.scss';




export default function Compiler() {

    const [files, setFiles] = useState(['main']);
    const [currentFile, setCurrentFile] = useState('main');
    const [darkMode, setDarkMode] = useState(localStorage['darkMode'] === 'true');
    const [code, setCode] = useState('');
    const [allCodes, setAllCodes] = useState({main: '', test: ''});
    const [languagesDialog, setLanguagesDialog] = useState(false);
    const [language, setLanguage] = useState(localStorage['language'] || 'Python');
    const [output, setOutput] = useState(['hello', '1231', 'Syntax Error']);
    const languages = {
        'Python': Svg.Python(),
        'JavaScript': Svg.Javascript(),
        'Kotlin': Svg.Kotlin(),
        'Java': Svg.Java(),
        'C#': Svg.Csharp()
    }
    const extensions = {
        'Python': 'py',
        'JavaScript': 'js',
        'Kotlin': 'kt',
        'Java': 'java',
        'TypeScript': 'ts',
        'C#': 'cs'
    }


    useEffect(() => {
        setAllCodes({...allCodes, [currentFile]: code});
    }, [code])


    useEffect(() => {
        setCode(allCodes[currentFile]);
    }, [allCodes, currentFile])


    return (
        <div className={`compiler-body ${darkMode && "dark-mode"}`}>
            <div className={"compiler-content"}>
                <div className={`compiler-top-buttons`}>
                    <div className={'buttons'}>
                        <button>
                            <FaSave/>
                        </button>

                        {/*<button>*/}
                        {/*    <RiFolderOpenLine/>*/}
                        {/*</button>*/}

                        {/*<button>*/}
                        {/*    <FaUndo/>*/}
                        {/*</button>*/}

                        {/*<button>*/}
                        {/*    <FaRedo/>*/}
                        {/*</button>*/}
                    </div>

                    <div className={'buttons'}>
                        {/*<button>*/}
                        {/*    <IoMdSettings/>*/}
                        {/*</button>*/}

                        <button onClick={() => setDarkMode(dark => !dark)}>
                            { darkMode ? <BsFillSunFill/> : <BsMoonFill/> }
                        </button>

                        <button className={'js-icon'} onClick={() => setLanguagesDialog(lan => !lan)}>
                            {languages[language]}
                        </button>
                    </div>
                </div>

                <div className={"compiler-editor"}>
                    <div className={'compiler-top'}>
                        <div className={'files'}>
                            { files.map((file, index) => (
                                <span key={index} className={file === currentFile ? 'current-file' : ''} onClick={() => setCurrentFile(file)}>
                                    {file}.{extensions[language]}
                                </span>
                            ))
                            }

                            {/*<button>*/}
                                {/*<BsPlusLg/>*/}
                            {/*</button>*/}
                        </div>
                    </div>

                    <div className={'ace-wrapper'}>
                        <Editor theme={darkMode ? 'monokai' : 'xcode'} code={code} setCode={setCode} language={language.toString().toLowerCase()}/>
                    </div>
                </div>

                <div className={'run-row'}>
                    <div className={'run-button'}>
                        <svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                            <path d="M11.596 8.697l-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z"/>
                        </svg>
                        <span>Run</span>
                    </div>

                    <input type={'text'} placeholder={'Command line arguments (optimal)'}/>
                </div>

                <div className={'terminal-wrapper'}>
                    <div className={'terminal-buttons'}>
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

                    <div className={'terminal-content'}>
                        {output.map((item, index) => (
                            <div key={index}>
                                <span>{item}</span>
                            </div>
                        ))
                        }
                    </div>
                </div>
            </div>

            <LanguageDialog languages={languages} setLanguage={setLanguage} show={languagesDialog} setShow={setLanguagesDialog}/>
        </div>
    )
}

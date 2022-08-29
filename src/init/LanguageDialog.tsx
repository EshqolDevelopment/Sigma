import React, { useEffect, useRef } from "react";
import {Language} from "../DataTypes";


type Props = {
    languages: { [key: string]: any };
    show: boolean;
    setLanguage: (language: Language) => void;
    editor?: boolean;
    setShow?: (show: boolean) => void;
    setCode?: (code: string) => void;
    LanguageToHelloCode?: { [key: string]: string };
}


const toDisplayName = {
    "python": "Python",
    "javascript": "JavaScript",
    "typescript": "TypeScript",
    "java": "Java",
    "kotlin": "Kotlin",
    "csharp": "C#",
    "c": "C",
    "cpp": "C++",
    "Python": "Python",
    "JavaScript": "JavaScript",
    "TypeScript": "TypeScript",
    "Java": "Java",
    "C#": "C#",
    "Kotlin": "Kotlin",
}


export function LanguageDialog(props: Props) {

    const LanguageDialog = useRef<HTMLDialogElement>();
    const languages = props.languages;

    useEffect(() => {
        if (props.show && !LanguageDialog.current.open) {
            LanguageDialog.current.showModal();
        } else if (!props.show && LanguageDialog.current.open) {
            LanguageDialog.current.close();
        }
    }, [props.show]);


    const changeLanguage = (l) => {
        const language = l.toLowerCase()
        localStorage['language'] = language;
        if (props.editor) props.setCode(props.LanguageToHelloCode[language]);
        props.setLanguage(language);
        props.setShow(false);
    }

    return (
        <dialog className={"modal"} ref={LanguageDialog}>
            <div className={"container-modal"}>
                <div className={"modal-header"}>
                    <img src={"https://static.thenounproject.com/png/57781-200.png"}
                         onClick={() => props.setShow(false)} alt={'Close'}/>
                    <h3>Choose a language</h3>
                </div>

                <div className={'languages-list'}>
                    {
                        Object.keys(languages).map((language, index) => (
                            <div key={index} onClick={() => changeLanguage(language)}>
                                {languages[language]}
                                <h3>{toDisplayName[language]}</h3>
                            </div>
                        ))
                    }
                </div>
            </div>
        </dialog>
    );
}

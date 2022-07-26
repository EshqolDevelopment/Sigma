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
    "java": "Java",
    "kotlin": "Kotlin",
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


    const changeLanguage = (language: Language) => {
        localStorage['language'] = language;
        if (props.editor) props.setCode(props.LanguageToHelloCode[language]);
        props.setLanguage(language);
        props.setShow(false);
    }

    return (
        <dialog className={"modal"} ref={LanguageDialog}>
            <div className={"container-modal"}>
                <div className={"modal-header"}>
                    <img src={"/images/x.png"}
                         onClick={() => props.setShow(false)} alt={'Close'}/>
                    <h3>Choose a language</h3>
                </div>

                <div className={'languages-list'}>
                    {
                        Object.keys(languages).map((language: Language, index) => (
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

import React, { useEffect, useRef } from "react";

type Props = {
    languages: string[];
    show: boolean;
    setLanguage: (language: string) => void;
    setShow: (show: boolean) => void;
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


    const changeLanguage = (language) => {
        localStorage['language'] = language;
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
                                <h3>{language}</h3>
                            </div>
                        ))
                    }
                </div>
            </div>
        </dialog>
    );
}

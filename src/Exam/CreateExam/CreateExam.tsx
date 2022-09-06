import React, { useState, useEffect } from "react";
import "./CreateExam.scss";


export default function CreateExam() {
    const [details, setDetails] = useState({
        name: "",
        description: "",
        duration: "",
        questions: [],
        language: [],
    });


    useEffect(() => {

        const add = (n) => {
            const id = document.getElementById(`ce-${n}`);
            if (!id?.classList.contains("visible"))
                id?.classList.add("visible");
        }

        const remove = (n) => {
            for (let i = n; i < 6; i++) {
                const id = document.getElementById(`ce-${i}`);
                if (id?.classList.contains("visible"))
                    id?.classList.remove("visible");
            }
        }


        if (details.name !== "") add(2)
        else return remove(2);

        if (details.language.length > 0) add(3)
        else return remove(3);




    }, [details]);


    const handle = (e) => {
        setDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    }


    const addLanguage = (e) => {
        const language = details.language;
        e.target.checked ? language.push(e.target.value) : language.splice(language.indexOf(e.target.value), 1);

        setDetails((prev) => ({
            ...prev,
            language: [...new Set(language)],
        }));
    }


    const getText = (e) => {
        let text = '';

        e.forEach((lang, index) => {
            if (index == e.length - 1) text += lang;
            else if (e.length - 2) text += lang + ', ';
            else text += lang + ' and ';
        })

        return text;
    }


    return (
        <div>
            <div className="create-exam">
                <div>
                    <h1>Create Exams & Interview Tests</h1>
                    <div>
                        It never been easier to create programming exams and interview tests.<br/>
                        with a simple generator and a few clicks you can crete the perfect exam<br/>
                        and we will take care of the rest.
                    </div>
                </div>
            </div>

            <div className={'create-exam-form'}>
                <div id={'ce-1'} className={'row visible'}>
                    <h2>Let's start with naming this exam</h2>
                    <input name={'name'} type={'text'} placeholder={'My exam name is...'} onChange={handle}/>
                </div>

                <div id={'ce-2'} className={'column'}>
                    <h2>Which languages are you allowing?</h2>

                    <div>
                        <span>{details.language.length === 0 ? 'Please select at least one language' : `I'm allowing ${getText(details.language)}`}</span>
                    </div>

                    <div className={'column'}>
                        <div>
                            <input type={'checkbox'} name={'python'} value={'Python'} onChange={addLanguage}/>
                            <label>Python</label>
                        </div>

                        <div>
                            <input type={'checkbox'} name={'languages'} value={'JavaScript'} onChange={addLanguage}/>
                            <label>JavaScript</label>
                        </div>
                    </div>
                </div>

                <div id={'ce-3'} className={'row'}>
                    <h2>Add at least question for your exam</h2>
                    <input name={'name'} type={'text'} placeholder={'My exam name is...'} onChange={handle}/>
                </div>
            </div>
        </div>
    );
}
import React, {useEffect, useState} from 'react';
import {GlobalContext} from "../Global";
import s from "./Upload.module.scss";
import {Language, Level, DataToSendTypes} from "../DataTypes";
import Editor from "../init/Editor";


type QuestionData = {
    description: string;
    level: Level;
    subject: string;
    languages: Language[];
}



export default function Upload() {
    const [data, setData] = useState<QuestionData>({
        description: "",
        level: "easy",
        subject: "",
        languages: ['python', 'javascript', 'java', 'kotlin'],
    });
    const [changedTime, setChangedTime] = useState(false);
    const [asserts, setAsserts] = useState<{[key: string]: string}>({});
    const [currentLanguage, setCurrentLanguage] = useState<Language>("python");
    const languages = ['python', 'javascript', 'java', 'kotlin'];

    const [solutions, setSolutions] = useState<{ [key in Language]: string }>({
        python: "",
        javascript: "",
        java: "",
        kotlin: ""
    });

    const globalContext = React.useContext(GlobalContext);
    const username = globalContext?.username;

    useEffect(() => {
        document.documentElement.style.setProperty('--background', 'dodgerblue');
        if (!username) return;
        const isAdmin = ["yoavyshalev_"].includes(username);
        if (!isAdmin) window.location.href = "/404";
    }, [username]);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target;
        setData({...data, [name]: value});

        if (name === "time" && !changedTime) {
            setChangedTime(true);
        }
    }

    const displayNames = {
        python: "Python",
        javascript: "JavaScript",
        java: "Java",
        kotlin: "Kotlin"
    }

    const Languages = <div className={s.languages}>
        {languages.map((language, i) => (
            <button type={"button"} className={data.languages.includes(language as Language) ? s.active : s.inactive}
                onClick={() => {
                    if (data.languages.includes(language as Language))
                        setData({...data, languages: data.languages.filter(l => l !== language as Language)});
                    else
                        setData({...data, languages: [...data.languages, language as Language]});
                }
            }>{displayNames[language]}</button>
        ))}
    </div>

    const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setCurrentLanguage(e.target.value as Language)
    }

    const submit = async (e) => {
        e.preventDefault();
        const input = prompt("Please enter the password", "");

        const name = solutions[currentLanguage].split("def ")[1].split("(")[0].trim();
        const params = solutions[currentLanguage].split("def ")[1].split("(")[1].split(")")[0].split(",").map(p => p.trim());
        const returnType = solutions[currentLanguage].split('\n')[0].split("->")[1].replaceAll(":","").trim();

        const description = data.description;
        const level = data.level;
        const subject = data.subject;
        const languages = data.languages;

        const suggestedTime = {
            easy: 1200,
            medium: 2000,
            hard: 2750
        }

        const dataToSend: DataToSendTypes = {
            name: name,
            params: params,
            returnType: returnType,
            description: description,
            level: level,
            subject: subject,
            languages: languages,
            time: suggestedTime[level],
            asserts: asserts,
            solutions: solutions
        }

        console.log(dataToSend);
    }


    return (
        <div className={s.container}>
            <div className={s.title}>
                <span>Upload Question</span>
            </div>

            <form className={s.form} onSubmit={submit}>
                {Languages}

                <div>
                    <input type="text" placeholder={'Subject'} name={'subject'} value={data.subject} onChange={handleInputChange}/>
                    <select name="level" defaultValue={data.level} onChange={(e) => handleInputChange(e as any)}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                </div>

                <textarea placeholder={'Description'} name={'description'} value={data.description} onChange={(e) => {
                    setData({...data, description: e.target.value});
                }}/>

                <div className={s.solutions + ' ' + s.asserts}>
                    <div className={s.assertsTitle}>
                        <label>Solution for</label>
                        <select name="language" defaultValue={currentLanguage} onChange={handleLanguageChange}>
                            {languages.map((language, i) => (
                                <option value={language}>{displayNames[language]}</option>
                            ))}
                        </select>
                    </div>

                    <Editor code={solutions[currentLanguage]} setCode={(code) => setSolutions({...solutions, [currentLanguage]: code})} language={currentLanguage}/>
                </div>

                <div className={s.asserts}>
                    <div className={s.assertsTitle}>
                        <label>Asserts</label>
                    </div>

                    <Editor code={asserts[currentLanguage]} setCode={(code) => setAsserts({...asserts, [currentLanguage]: code})} language={currentLanguage}/>
                </div>

                <button className={'sigma-button'}>Submit</button>
            </form>
        </div>
    );
}


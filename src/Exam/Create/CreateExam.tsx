import React, {useState, useEffect, useContext} from "react";
import "./CreateExam.scss";
import {ExamDetails, PracticeQuestionList} from "../../DataTypes";
import {GlobalContext, postRequest} from "../../Global";
import {BsArrowLeft, BsArrowRight} from "react-icons/bs";
import {AiFillCheckSquare} from "react-icons/ai";
import {FaTrashAlt} from "react-icons/fa";
import Footer from "../../CommonComponents/Footer/Footer";
import {useNavigate} from "react-router-dom";
import ShareExamDialog from "../ShareExam/ShareExamDialog";


let fetched = false;


export default function CreateExam() {
    const [details, setDetails] = useState<ExamDetails>({
        name: "",
        description: "",
        duration: "",
        passingScore: "",
        finishNote: "",
        questions: [],
        languages: [],
    });
    const [questionDict, setQuestionDict] = useState<PracticeQuestionList>({Easy: [], Medium: [], Hard: []});
    const [index, setIndex] = useState(0);
    const [search, setSearch] = useState("");
    const [sendingDataToServer, setSendingDataToServer] = useState(false);
    const [showShareExam, setShowShareExam] = useState(false);
    const [examId, setExamId] = useState("");
    const globalContext = useContext(GlobalContext);

    useEffect(() => {
        if (fetched) return
        fetched = true

        postRequest("/general/getQuestionList", {}).then((res: PracticeQuestionList) => {
            setQuestionDict(res)
        })
    }, [])

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#050536");
    }, []);


    const handle = (e) => {
        setDetails((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };


    const addLanguage = (e) => {
        const language = details.languages;
        e.target.checked ? language.push(e.target.value) : language.splice(language.indexOf(e.target.value), 1);

        setDetails((prev) => ({
            ...prev,
            languages: [...new Set(language)],
        }));
    }


    const getText = (arr: string[]) => {
        let text = '';

        arr.forEach((lang, index) => {
            if (index === arr.length - 1) text += lang;
            else if (index === arr.length - 2) text += lang + ' and ';
            else text += lang + ', ';
        })

        return text;
    }


    const questionDisplayName = (name: string) => {
        const temp = name.replaceAll("_", " ")
        return temp.charAt(0).toUpperCase() + temp.slice(1);
    }


    const GetQuestions = (filter) => {
        const arr = [];

        for (const level in questionDict) {

            const dict = questionDict[level];
            const level_ = level.toLowerCase();
            for (const question of dict) {

                const filter_ = filter.toLowerCase();
                const display = questionDisplayName(question.name);

                if (!details.questions.includes(question.name) && (display.toLowerCase().includes(filter_) || filter_.includes(level_))) {
                    arr.push(
                        <div className={`question-item123`} key={question.name}>
                            <span>{display}</span>
                            <div className={`question-list-${level.toLowerCase()}`}>
                                <button onClick={() => {
                                    const questions = details.questions;
                                    questions.push(question.name);
                                    setDetails((prev) => ({
                                        ...prev,
                                        questions: [...new Set(questions)],
                                    }))
                                }}>+</button>
                            </div>
                        </div>
                    )
                }
            }
        }

        return arr.length === 0 ? <span className={"no-question"}>No question found</span> : arr;
    }


    const setError = (e) => {
        const element = document.getElementById('error');
        element.innerText = e;
        element.animate([
            {color: 'red', offset: 0},
            {color: 'darkred', offset: 0.3},
            {color: 'red', offset: 1},
        ], {
            duration: 500,
        })
    }


    const increaseIndex = () => {
        if (index === 0) {
            if (details.name === "") return setError("Please enter a name for the exam");
            if (details.description === "") return setError("Please enter a description for the exam");
        } else if (index === 1) {
            if (details.duration === "") return setError("Please enter a duration for the exam");
            if (details.languages.length === 0) return setError("Please select a language for the exam");
            if (details.passingScore === "" || parseInt(details.passingScore) > 100 || parseInt(details.passingScore) < 0) return setError("Please enter a valid passing score");
        } else if (index === 2) {
            if (details.questions.length === 0) return setError("Please select at least one question");
        } else if (index === 3) {
            if (details.finishNote === "") return setError("Please enter a finish note for the exam");
        }

        setIndex((prev) => prev + 1);
        setError("");
    }


    const removeQuestion = (e) => {
        const questions = details.questions;
        questions.splice(questions.indexOf(e), 1);
        setDetails((prev) => ({
            ...prev,
            questions: [...new Set(questions)],
        }))
    }


    const createExamAction = async () => {
        setSendingDataToServer(true);
        const res = await postRequest("/exam/createExam", {...details, uid: globalContext.userData.uid}) as {examID: string}
        setSendingDataToServer(false);
        if (!res.examID) {
            globalContext.showToast("Something went wrong", "error");
        } else {
            setExamId(res.examID);
            setShowShareExam(true);
        }
    }

    return (
        <div>
            <div className={'create-exam-private'}>
                <div className="create-exam-header">
                    {
                        details.name === "" ?
                            <div className={'preview'}>
                                <h3 className={"preview-default-title"}>Create Exams & Interview Tests</h3>
                                <p>
                                    It never been easier to create programming exams and interview tests.
                                    with a simple generator and a few clicks you can crete the perfect exam
                                    and we will take care of the rest.
                                </p>
                            </div> :

                            <div className={'preview'}>
                                <h3>{details.name}</h3>
                                { details.description && <span className={"preview-desc"}>{details.description}</span> }
                                <div className={"preview-exam-details"}>
                                    { details.duration && <span><span style={{fontWeight: "bold"}}>Duration:</span>{details.duration} seconds</span> }
                                    { details.passingScore && <span><span style={{fontWeight: "bold"}}>Passing Score:</span>{details.passingScore}/100</span> }
                                    { details.languages.length > 0 && <span><span style={{fontWeight: "bold"}}>Languages:</span>{getText(details.languages)}</span> }
                                    { details.questions.length > 0 && <span><span style={{fontWeight: "bold"}}>Questions:</span>{getText(details.questions.map((key) => questionDisplayName(key)))}</span> }
                                </div>

                            </div>
                    }
                </div>

                <div className={'create-exam-form'}>
                    {
                        [
                            <div className={'exam-start-info'}>
                                <h2>Let's start with naming this exam</h2>
                                <input name={'name'} type={'text'} placeholder={'My exam name is...'} onChange={handle} value={details.name}/>

                                <textarea name={'description'} placeholder={'Description...'} onChange={handle} value={details.description}/>
                            </div>,

                            <div className={'exam-details'}>
                                <h2>Let's add some setup settings</h2>
                                <div className={"input-container"}>
                                    <span>Max Duration</span>
                                    <input name={'duration'} type={'text'} placeholder={'Max duration in seconds:'} onChange={handle} value={details.duration}/>

                                </div>
                                <div className={"input-container"}>
                                    <span>Passing Score</span>
                                    <input max={100} min={0} name={'passingScore'} type={'text'} placeholder={'Passing score (0 to 100, recommended 55):'} onChange={handle} value={details.passingScore}/>
                                </div>
                                <div className={"language-picker-exam"}>
                                    {
                                        ['Python', 'JavaScript', 'Kotlin', 'Java'].map((lang, index) => (
                                            <div key={index}>
                                                <input type={'checkbox'} name={lang} value={lang} onChange={addLanguage}/>
                                                <img src={`/images/${lang.toLowerCase()}.png`} alt={lang}/>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>,

                            <div className={'your-questions'}>
                                <h2>Now let's add some questions</h2>

                                <input type={'text'} placeholder={'Search for question...'} value={search} onChange={(e) => {
                                    setSearch(e.target.value);
                                }}/>

                                <div className={'chosen-questions'}>
                                    { details.questions.length === 0 ? <span style={{ fontWeight: "bold"}}>You have no questions yet</span> : details.questions.map((question, index) => (
                                        <div key={index}>
                                            <span>{questionDisplayName(question)}</span>
                                            <button onClick={() => removeQuestion(question)} className={'removeDefault'}>
                                                <FaTrashAlt/>
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                <div className={'list-questions'}>
                                    {GetQuestions(search)}
                                </div>
                            </div>,

                            <div className={'exam-finish'}>
                                <h2>Write a finish message for the exam</h2>
                                <textarea name={'finishNote'} placeholder={'I hope it went well, and good luck!'} onChange={handle} value={details.finishNote}/>
                            </div>

                        ][index]
                    }

                    <div className={'arrows'}>
                        <div style={{opacity: index === 0 ? '0' : '1'}}>
                            <button onClick={() => setIndex(i => i === 0 ? i : i - 1)}>
                                <BsArrowLeft/>
                            </button>
                            <span>Go Back</span>
                        </div>

                        <div>
                            { index < 3 ?
                                <div>
                                    <button onClick={increaseIndex}>
                                        <BsArrowRight/>
                                    </button>
                                    <span>Next Step</span>
                                </div> :
                                <div>
                                    {!sendingDataToServer && <>
                                        <button onClick={createExamAction} className={"create-exam-btn"}>
                                            <AiFillCheckSquare/>
                                        </button>
                                        <span>Create Exam</span>
                                    </>}

                                    {sendingDataToServer && <div className={"spinner111"}/>}
                                </div>
                            }
                        </div>
                    </div>

                    <span id={'error'}/>
                </div>


                {showShareExam && <ShareExamDialog examId={examId} show={showShareExam} setShow={setShowShareExam}/>}
            </div>

            <Footer/>
        </div>

    );
}

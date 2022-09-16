import React, {useState, useEffect, useContext} from "react";
import './Exam.scss';
import { MdOutlineCheckBox as Checked, MdOutlineCheckBoxOutlineBlank as Unchecked} from 'react-icons/md';
import {ExamData, LiteQuestionData} from "../../DataTypes";
import {GlobalContext, postRequest, questionName} from "../../Global";
import Loading from "../../CommonComponents/Loading/Loading";
import Footer from "../../CommonComponents/Footer/Footer";



export default function Exam() {

    const [exam, setExam] = useState({} as ExamData);
    const [answers, setAnswers] = useState({} as { [key: string]: string });
    const globalContext = useContext(GlobalContext);

    const getAmountOfAnswers = () => {
        if (!exam.questions) return ''
        const answersLen = Object.values(answers).filter(answer => answer !== '').length;
        const questionsLen = exam.questions.length;

        if (answersLen === 0)
            return "Let's start the exam!";

        if (answersLen === questionsLen)
            return "You have answered all the questions!";

        return `You have answered ${answersLen} out of ${questionsLen} questions`;
    }


    useEffect(() => {
        const url = window.location.href;
        const examId = url.split("/").at(-1);
        postRequest("/exam/getExam", {
            examID: examId,
        }).then((data) => {
            setExam(data as ExamData);
            console.log(data);
        })
        document.documentElement.style.setProperty("--background", "dodgerblue");

    }, [])


    const QuestionItem = (question: LiteQuestionData, index) => (
        <div className={'exam-question-item'} key={index}>
            <div className={'question-' + question.level}>
                <span className={'level-icon'}>{question.level.slice(0, 1).toUpperCase()}</span>
                <div className={'name-and-description'}>
                    <h3>{questionName(question.name)}</h3>
                    <span>{question.description}</span>
                </div>
            </div>
            {answers[question.name] ? <Checked color={'forestgreen'}/> : <Unchecked/>}
        </div>
    )

    return (
        <>
            {exam.questions && <div className={'exam-box'}>
                <div className={'exam-title'}>
                    <img src={'/images/512_logo.png'} alt={'Sigma Logo'}/>
                </div>

                <div className={'exam-description'}>
                    <h2>{globalContext?.userData?.displayName}, welcome to the {exam.name}!</h2>

                    <div>
                        <span className={'time-remain'}>104 seconds remains</span>
                        <span>{getAmountOfAnswers()}</span>
                        <span className={'min-score'}>score above <b>55</b> to pass</span>
                    </div>

                    <span>{exam.description}</span>
                </div>

                <div className={'exam-questions'}>
                    {
                        exam.questions.map((question, index) => (
                            QuestionItem(question, index)
                        ))
                    }{
                    exam.questions.map((question, index) => (
                        QuestionItem(question, index)
                    ))
                }
                </div>

                <div className={'exam-finish-note'}>
                    <span>{exam.finishNote}</span>
                </div>

                <div className={'exam-finish-button'}>
                    <button className={'exam-button'}>Submit Exam</button>
                </div>
            </div>}
            {!exam.questions && <Loading/>}

            <Footer/>
        </>
    )
}
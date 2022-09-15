import React, {useState, useEffect} from "react";
import './Exam.scss';
import {MdCheckBoxOutlineBlank, MdCheckBox} from "react-icons/md";



export default function Exam() {

    const listOfQuestions = ['Bigger than 5', 'Smaller than 5', 'Equal to 5', 'Bigger than 10']

    const [data, setData] = useState({
        username: 'Yoav',
        examId: 123,
        questions: listOfQuestions,
        examName: 'Test Exam',
        answers: listOfQuestions.reduce((acc, question) => {
            acc[question] = 'dd';
            return acc;
        }, {})
    });

    return (
        <div className={'exam-questions'}>
            <div>
                <h2>{data.username}, welcome to the {data.examName}!</h2>

                <div className={'question-exam'}>
                    {
                        data.questions.map((question, index) => {
                            // random level from Easy, Medium, Hard
                            const levels = ['Easy', 'Medium', 'Hard'];
                            const level = levels[Math.floor(Math.random() * levels.length)];


                            return <div className={level.toLowerCase()} key={index}>
                                <h3>{question}</h3>
                                <span>{level}</span>
                                { data.answers[question] === '' ? <MdCheckBoxOutlineBlank/> : <MdCheckBox/> }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    )
}
import React, {useState, useEffect} from 'react';
import {useNavigate} from "react-router";
import Loading from '../../CommonComponents/Loading/Loading';
import './Welcome.scss';


export default function Welcome() {

    const [details, setDetails] = useState({creator: '', id: '', examName: '', questions: []});
    const [examExists, setExamExists] = useState(null);
    const navigate = useNavigate()


    useEffect(() => processParams(), []);


    useEffect(() => {
        // check if the exam exists
        setTimeout(() => {
            const res = {'valid': true}
            if (!res.valid) navigate('/404');
            else setExamExists(true);
        }, 1000);
    }, [details])


    const processParams = () => {
        let params = window.location.search.slice(1).split('&')
        const dict = {}
        for (const param of params) {
            const [key, value] = param.split('=')
            dict[key] = value
        }

        if (dict['id']) {
            // get request to get the exam info
            const res = {creator: 'yoav', id: '123', examName: 'test', questions: ['Bigger than 5', 'Smaller than 5']}

            // @ts-ignore
            if (res === {'error': 'not found'}) navigate('/404');
            else setDetails(res)
        }

        else navigate('/404')
    }


    const onSubmit = () => {
        const inputs = document.forms["welcome-form"].getElementsByTagName("input");
        const user = {password: ''};
        for (const input of inputs)
            user[input.name] = input.value;

        // if user contain empty fields
        if (Object.values(user).some(val => val === '')) {
            alert('Please fill all the fields');
            return;
        }

        navigate(`/exam?id=${details.id}`);
    }


    const Form = () => (
        <form className={'welcome-to-exam-form'} id={'welcome-form'} autoComplete={'off'}>

            <span>
                In the exam there will be {details.questions.length} questions. and you will have 10 minutes to answer them.
                Score above 55 to pass the exam.<br/>
                <b>Good luck!</b> <br/><br/>
                Before we start, please enter few details
            </span>

            <div>
                <span>Exam Password</span>
                <input type={'password'} name={'password'}/>
            </div>

            <div>
                <span>Name</span>
                <input type={'text'} name={'name'}/>
            </div>

            <div>
                <span>Email</span>
                <input type={'email'} name={'email'}/>
            </div>

            <button type={'button'} className={'sigma-button'} onClick={onSubmit}>Start Exam</button>
        </form>
    )



    return (
        <div>
            { examExists ?
                <div className={'welcome-to-exam'}>
                    <div>
                        <h2 className={'welcome-to-exam-title'}>Welcome to the exam "{details.examName}!"</h2>
                        <Form/>
                    </div>
                </div>

                : <Loading/>
            }
        </div>
    );
}
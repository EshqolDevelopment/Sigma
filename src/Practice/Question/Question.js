import React, { useState, useEffect } from 'react';
import Editor from "../../init/Editor";
import './Question.css';





export default function Question(props) {

    const [data, setData] = useState({})
    const [timer, setTimer] = useState(0)
    const [code, setCode] = useState('')

    useEffect(() => {

            const location = window.location.pathname.split('/').slice(1)

            const questionName = location[1].replaceAll('%20', ' ')
            const pythonName = questionName.replaceAll(' ', '_').toLowerCase()
            const data = JSON.parse(sessionStorage['questions'])

            const names = data['names'].split('@')
            const username = 'Yoav'

            const [_, subject, level] = names.find(name => name.split('&')[0] === questionName).split('&')

            let [defaultCode, description, time] = data[level.toLowerCase()].split('@').find(splitElement => splitElement.split('&')[0].split('(')[0] === pythonName).split('&')

            defaultCode = `def ${defaultCode}:\n\t`

            const temp = {}
            temp['code'] = defaultCode
            temp['description'] = description
            temp['subject'] = subject
            temp['level'] = level
            temp['name'] = questionName
            temp['username'] = username
            setData(temp)
            setTimer(time)

    }, [])


    useEffect(() => {

        if (timer === 0) return

        const clear = setInterval(() => {
            setTimer(timer - 1)
        }, 1000)

        return () => clearInterval(clear)

    }, [timer])


    useEffect(() => { if (data['code']) setCode(data['code']) } , [data])


    return (
        <div className={'question-layout'}>
            <div className={'question-left'}>

                <button className={'sigma-button'}>Run</button>

                <div>
                    <img src={require('../../Photos/p2.png')} alt={'Profile Image'}/>
                    <span>{data['username']}</span>
                    <span>{timer}</span>
                </div>


                <h2>{data['name']}</h2>

                <span>{data['description']}</span>
            </div>

            <div className={'question-right'}>
                <Editor language={'python'} code={code} setCode={setCode}/>
            </div>

        </div>
    );
}


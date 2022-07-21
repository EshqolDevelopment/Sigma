import React, {useEffect, useState} from "react";
import './ListOfQuestions.css'
import {app} from "../../init/firebase";
import {doc, getDoc, getFirestore} from "firebase/firestore";


const db = getFirestore(app)


export default function ListOfQuestions() {

    const [currentDragItem, setCurrentDragItem] = useState(null)
    const [itemOnMouseIndex, setItemOnMouseIndex] = useState(null)
    const ItemHeight = 60
    const [questionList, setQuestionList] = useState([])
    const [dictionary, setDictionary] = useState({})


    async function fetchQuestions() {

        if (sessionStorage["questions"])
            return JSON.parse(sessionStorage["questions"])

        const ref = doc(db, 'questions/python')
        const data = await getDoc(ref)
        const questions = data.data()

        sessionStorage['questions'] = JSON.stringify(questions)
        setQuestionList(questions)
    }
    
    
    function onMouseDown(key) {
        const index = questionList.findIndex(item => item[3] === key)
        setCurrentDragItem(index)
    }
    
    
    function onMouseUp(item) {
        if (itemOnMouseIndex !== currentDragItem && ![itemOnMouseIndex, currentDragItem].includes(null)) {
            console.log(itemOnMouseIndex, currentDragItem)
            const newLst = [...questionList]

            const item1 = questionList[itemOnMouseIndex]
            newLst[itemOnMouseIndex] = questionList[currentDragItem]
            newLst[currentDragItem] = item1
            setQuestionList(newLst)
        }

        setCurrentDragItem(null)
        setItemOnMouseIndex(null)
    }

    function onMouseMove(e) {
        if (!currentDragItem) return

        const y = e.pageY
        const offsetY = y - 210
        const itemOnMouseIndex = Math.floor(offsetY / ItemHeight)
        setItemOnMouseIndex(itemOnMouseIndex)
    }


    useEffect(() => {
        fetchQuestions().then(allQuestions => {

            const dict = {}

            for (const level of ['easy', 'medium', 'hard']) {
                for (const dataArray of allQuestions[level].split('@')) {
                    const [name, description, time] = dataArray.split('&')
                    dict[name.split('(')[0]] = [description, time]
                }
            }

            setQuestionList(allQuestions['names'].split('@').map((val, i) => [...val.split('&'), i]))
            setDictionary(dict)
        })
    }, [])


    return (
        <div className={'list-questions-content'} onMouseUp={onMouseUp} onMouseMove={onMouseMove}>
            <h2 className={'home-title'}>Practice any question in your level, supporting over 10 languages!</h2>

            <div id={'id'} className={'questions-list'}>
                {
                    questionList.map((data, i) => {
                        let [name, subject, level] = data
                        const isMultiArgument = subject.startsWith('$')
                        subject = isMultiArgument ? subject.substring(1) : subject
                        const [description, time] = dictionary[name.replaceAll(' ', '_').toLowerCase()]

                        return (
                            <div key={i} className={'question-item'}>

                                <div onClick={() => window.location.href = `/practice/${name}`}>
                                    <div className={'circle'}/>
                                    <span>{name}</span>
                                </div>

                                <div className={`grab-color color-${level.toLowerCase()}`} onMouseDown={() => onMouseDown(i)} />
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
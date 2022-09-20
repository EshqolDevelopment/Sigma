import React from "react";
import {Exam} from "../../DataTypes";


const GetStars = (stars: number): JSX.Element[] => {
    const starsArray = []
    const rest = stars - Math.floor(stars)

    for (let i = 0; i < Math.floor(stars); i++)
        starsArray.push(<img key={starsArray.length} src={'/images/star.svg'} alt={'Star'}/>)

    if (rest > 0.8)
        starsArray.push(<img key={starsArray.length} src={'/images/star.svg'} alt={'Star'}/>)

    else if (rest > 0.2)
        starsArray.push(<img key={starsArray.length} src={'/images/halfstar.svg'} alt={'Star'}/>)

    while (starsArray.length < 5)
        starsArray.push(<img key={starsArray.length} src={'/images/emptystar.svg'} alt={'Empty star'}/>)

    return starsArray
}

export default function ExamItem(props: { exam: Exam, type: string }) {

    const exam = props.exam

    return <div data-kind={props.type} className={'exam-item'}>
        <span className={'item-title'}>{exam.title}</span>
        <span className={'item-description'}>{exam.description}</span>

        <ul className={'exam-troll'}>
            <li><b>Average:</b> {exam.average}</li>
            <li><b>Solvers:</b> {exam.count_solvers}</li>
            <li><b>Date added:</b> {new Date(exam.date_added).toLocaleDateString()}</li>
        </ul>

        <div className={'star-rating'}>
            {GetStars(exam.stars)}
        </div>
    </div>
}

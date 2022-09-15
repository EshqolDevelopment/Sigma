import {ExamData} from "../ExamDataTypes";
import {useEffect, useState} from "react";
import {postRequest} from "../../Global";
import styles from "./solveExam.module.scss";


export default function Exam() {
    const [exam, setExam] = useState({} as ExamData);

    useEffect(() => {
        const url = window.location.href;
        const examId = url.split("/").at(-1);
        postRequest("/exam/getExam", {
            examID: examId,
        }).then((data) => {
            console.log(data)
            setExam(data as ExamData);
        })
    }, [])

    return (
        <div>
            <main className={styles.container}>
                <div className={styles.examFirstPage}>
                    <h1>{exam.name}</h1>
                    <p>{exam.description}</p>
                </div>


            </main>

        </div>
    )
}

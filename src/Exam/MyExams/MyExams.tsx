import React, {useContext, useEffect, useState} from "react";
import {GlobalContext, postRequest} from "../../Global";
import {Helmet} from "react-helmet";
import styles from "./myExams.module.scss"
import {ExamListItem} from "../ExamDataTypes";
import MyExamRow from "./MyExamRow";
import {useNavigate} from "react-router-dom";
import '../SolveExam/solveExam.module.scss'


export default function MyExams() {
    const globalContext = useContext(GlobalContext);
    const [examData, setExamData] = useState<ExamListItem[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "dodgerblue");

        // const sample_student = {
        //     name: "John Doe",
        //     score: 50,
        //     timeTaken: 60,
        // }
        // const solvers = []
        // for (let i = 0; i < 2; i++) {
        //     solvers[i] = sample_student;
        // }
        //
        // const sampleExamData = {
        //     name: "Sample Exam",
        //     createdDate: "2021-05-01",
        //     averageScore: 25.6,
        //     solvers: solvers,
        // }
        // const examsData = []
        // for (let i = 0; i < 7; i++) {
        //     examsData[i] = sampleExamData;
        // }
        // setExamData(examsData);

        if (globalContext.userData) {
            postRequest("/exam/getExamList", {
                uid: globalContext.userData.uid,
            }).then((data) => {
                setExamData(data as ExamListItem[]);
            })

        }
    }, [globalContext.userData]);

    const createNewExam = () => {
        navigate("/create-exam");
    }


    return (
        <div>
            <Helmet>
                <title>My Exams - Sigma code wars</title>
                <meta name={"description"} content={"View all the exams you have created."}/>
            </Helmet>

            <main className={styles.mainContainer}>
                <div className={styles.container}>
                    <div className={styles.titleContainer}>
                        <span className={styles.title}>My Exams</span>
                        <button className={styles.examButton} onClick={createNewExam}>New Exam</button>
                    </div>

                    <div className={styles.table}>
                        <div className={[styles.tableHeader].join(" ")}>
                            <div style={{width: "50px"}}/>
                            <span>Exam Name</span>
                            <span>Date</span>
                            <span>Average</span>
                            <div/>
                            <div/>
                        </div>

                        { examData.length === 0 && <div className={styles.noExams}>
                            You have not created any exams yet.<br/>
                            Let's create your first one!
                        </div> }
                        {examData.map((exam, index) => (
                            <MyExamRow exam={exam} key={index}/>
                        ))}

                    </div>

                </div>
            </main>
        </div>
    );
}

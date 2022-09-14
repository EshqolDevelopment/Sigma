import styles from "./myExams.module.scss";
import React, {useState} from "react";
import {ExamData} from "../ExamDataTypes";
import ExamSolverRow from "./ExamSolverRow";
import ShareExamDialog from "../ShareExam/ShareExamDialog";

type Props = {
    exam: ExamData;
}

export default function MyExamRow(props: Props) {
    const [viewSolvers, setViewSolvers] = useState(false);
    const [showShareExam, setShowShareExam] = useState(false);
    const exam = props.exam;

    const formatDate = (date: string) => {
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString();
    }

    const viewAction = () => {
        setViewSolvers(!viewSolvers);
    }

    const openExamShare = () => {
        setShowShareExam(!showShareExam);
    }

    return (
        <div className={styles.tableRow}>
            <div className={styles.examRow}>
                <button className={styles.share} style={{width: "50px"}} onClick={openExamShare}>
                    <img src={"/images/share.png"}/>
                </button>
                <span>{exam.name}</span>
                <span>{formatDate(exam.createdDate)}</span>
                <span>{exam.averageScore}</span>
                <button className={styles.editeBtn}>
                    <span>Edit</span>
                    <img src={"/images/editIcon.png"} alt={"edit"}/>
                </button>
                <button className={[styles.viewBtn, viewSolvers ? styles.openArrow : ""].join(" ")} onClick={viewAction}>
                    <img src={"/images/arrow1.svg"}/>
                </button>
            </div>
            <div style={viewSolvers ? {maxHeight: (exam.solvers.length || 1) * 49 + "px"} : {}} className={[styles.solverContainer, viewSolvers ? styles.solverListOpen : styles.solverListClosed].join(" ")}>
                {exam.solvers.length > 0 && exam.solvers.map((solver, index) => (
                    <ExamSolverRow solver={solver} key={index}/>
                ))}

                {exam.solvers.length === 0 && (
                    <div className={[styles.solverRow, styles.noSolverRow].join(" ")}>
                        <span>No solvers yet</span>
                    </div>
                )}

            </div>

            {showShareExam && <ShareExamDialog examId={exam.id} show={showShareExam} setShow={setShowShareExam}/>}
        </div>
    )
}

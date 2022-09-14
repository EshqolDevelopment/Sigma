import styles from "./myExams.module.scss";
import React from "react";
import {Solver} from "../ExamDataTypes";

type Props = {
    solver: Solver;
}

export default function ExamSolverRow(props: Props) {
    const solver = props.solver;

    return (
        <div className={styles.solverRow}>
            <span><span>Student:</span> {solver.name}</span>
            <span><span>Auto Score:</span> {solver.score}</span>
            <span><span>Time:</span> {solver.timeTaken}</span>
            <button>Test</button>
        </div>
    )

}

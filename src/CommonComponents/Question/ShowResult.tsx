import React, {useEffect, useRef} from "react";
import styles from "./showResult.module.scss"
import {useNavigate} from "react-router-dom";

type Props = {
    close: () => void;
    result: string;
    statistics: { execTimePercentile: number, questionTimePercentile: number, execTime: number, questionTime: number };
    funcName: string;
    formatInput: (input: string[]) => JSX.Element[];
    practice: boolean;
    language: string;
    challenge?: boolean;
    level?: string;
}

function title(st: string) {
    return st.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase();});
}

export default  function ShowResult(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!dialogRef.current.open) dialogRef.current.showModal();
    }, [])

    const round = (number: number, decimalPoints: number) => {
        const temp = Math.floor(number * Math.pow(10, decimalPoints))
        return temp / (Math.pow(10, decimalPoints))
    }

    let input;
    let output;
    let expectedOutput;
    try {
        input = props.formatInput(JSON.parse(props.result).input)
        output = (JSON.parse(props.result).output).toString()
        expectedOutput = (JSON.parse(props.result).expected).toString()
    } catch (e) {

    }

    const json = input && output && expectedOutput

    const showChallengeDialog = () => {
        navigate("/?challenge=true")
    }

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            {props.result === "loading" && <div className={styles.loading}>
                <div className={styles.spinner}/>
                <span>Preprocessing your answer...</span>
            </div>}

            {!["loading", "success"].includes(props.result) && <div className={[styles.loading, styles.loadingError].join(" ")}>
                <div className={styles.spinner}/>

                {!json && <span aria-label={"Error description"}>{props.result}</span>}

                {json && <div className={styles.testCaseContainer}>
                    <div>
                        <span className={styles.testCaseTitle}>Input:</span>
                        <span className={styles.testCaseValue}>{input}</span>
                    </div>
                    <div>
                        <span className={styles.testCaseTitle}>Output:</span>
                        <span className={styles.testCaseValue}>{output}</span>
                    </div>
                    <div>
                        <span className={styles.testCaseTitle}>Excepted:</span>
                        <span className={styles.testCaseValue}>{expectedOutput}</span>
                    </div>
                </div>}


                <button onClick={props.close}>Try again</button>
            </div>}

            {props.result === "success" && !props.challenge && <div className={[styles.loading, styles.loadingSuccess].join(" ")}>
                <div className={styles.spinner}/>
                <span>Your answer is correct!</span>

                {props.practice && <>
                    <span>
                        <span style={{fontWeight: "bold"}}>Runtime: </span>
                        <span style={{color: "orange", fontWeight: "500"}}>{round(props.statistics.execTime / 1_000_000, 2)} ms</span>
                        <span style={{fontWeight: "500"}}>, faster than <span style={{color: "orange", fontWeight: "500"}}>{round(props.statistics.execTimePercentile, 2)}%</span> of {title(props.language)} online submissions for {props.funcName}.</span>
                    </span>

                    <span>
                        <span style={{fontWeight: "bold"}}>Time To Solve: </span>
                        <span style={{color: "orange", fontWeight: "500"}}>{round(props.statistics.questionTime / 60, 2)} minutes</span>
                        <span style={{fontWeight: "500"}}>, faster than <span style={{color: "orange", fontWeight: "500"}}>{round(props.statistics.questionTimePercentile, 2)}%</span> of {title(props.language)} online submissions for {props.funcName}.</span>
                    </span>
                </>}

                <button onClick={props.close}>Close</button>
            </div>}


            {props.result === "success" && props.challenge && <div className={[styles.loading, styles.loadingSuccess].join(" ")}>
                <div className={styles.spinner}/>

                <span style={{fontSize: "24px", textAlign: "center"}}>You completed the challenge</span>
                <span>You won <span style={{color: "orange"}}>200 coins</span></span>

                <button onClick={showChallengeDialog}>Show Remaining Challenges</button>
            </div>}

        </dialog>
    );
}

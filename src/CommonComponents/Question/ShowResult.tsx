import React, {useEffect, useRef} from "react";
import styles from "./showResult.module.scss"

type Props = {
    close: () => void;
    result: string;
}

export default  function ShowResult(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null)

    useEffect(() => {
        if (!dialogRef.current.open) dialogRef.current.showModal();
    }, [])

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            {/*<button onClick={props.close} className={styles.close}>*/}
            {/*    <img src={"/images/x.png"} alt={"close"}/>*/}
            {/*</button>*/}


            {props.result === "loading" && <div className={styles.loading}>
                <div className={styles.spinner}/>
                <span>Preprocessing your answer...</span>
            </div>}

            {!["loading", "success"].includes(props.result) && <div className={[styles.loading, styles.loadingError].join(" ")}>
                <div className={styles.spinner}/>
                <span aria-label={"Error description"}>{props.result}</span>
                <button onClick={props.close}>Try again</button>
            </div>}

            {props.result === "success" && <div className={[styles.loading, styles.loadingSuccess].join(" ")}>
                <div className={styles.spinner}/>
                <span>Your answer is correct!</span>
                <button onClick={props.close}>Close</button>
            </div>}


        </dialog>
    );
}

import styles from "../../CommonComponents/DailyChallenge/DailyChallenge.module.scss";
import {useEffect, useRef} from "react";
import SelectQuestionsNum from "../MultiPlayer/SelectQuestionsNum/SelectQuestionsNum";
import {useNavigate} from "react-router-dom";

type Props = {
    close: () => void;
}

export default function SinglePlayerConfigDialog(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();

    console.log("ssss")

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    const startPlaying = (questionsNum: number) => {
        navigate(`/play/single/${questionsNum}`);
    }

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            <div className={styles.container}>
                <button onClick={props.close} className={styles.close}>
                    <img src={"/images/x.png"} alt={"close dialog"}/>
                </button>

                <div>
                    <SelectQuestionsNum onSubmit={startPlaying} gap={"30px"}/>
                </div>
            </div>
        </dialog>
    )
}

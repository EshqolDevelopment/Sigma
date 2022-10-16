import dailyChallengeStyles from "../../CommonComponents/DailyChallenge/DailyChallenge.module.scss";
import {useEffect, useRef} from "react";
import SelectQuestionsNum from "../MultiPlayer/SelectQuestionsNum/SelectQuestionsNum";
import {useNavigate} from "react-router-dom";
import {Level} from "../../DataTypes";

type Props = {
    close: () => void;
    level: Level;
}

export default function SinglePlayerConfigDialog(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    const startPlaying = (questionsNum: number) => {
        navigate(`/single-player-game?level=${props.level}&questions=${questionsNum}`);
    }

    return (
        <dialog ref={dialogRef} className={dailyChallengeStyles.dialog}>
            <div className={dailyChallengeStyles.container}>
                <button onClick={props.close} className={dailyChallengeStyles.close}>
                    <img src={"/images/x.png"} alt={"close dialog"}/>
                </button>

                <div>
                    <SelectQuestionsNum onSubmit={startPlaying} gap={"30px"}/>
                </div>
            </div>
        </dialog>
    )
}

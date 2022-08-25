import styles from "./drawDialog.module.scss";


type Props = {
    onAccept: () => void;
    onDecline: () => void;
    opponentName: string;
}

export default function DrawDecisionDialog(props: Props) {
    return (
        <div className={styles.drawDialog}>
            <span>{props.opponentName} suggested a draw</span>

            <div>
                <button onClick={props.onAccept} className={styles.accept}>
                    <img src={"/images/check_mark.svg"} alt={"accept draw"}/>
                    <span>Accept</span>
                </button>
                <button onClick={props.onDecline} className={styles.reject}>
                    <img src={"/images/x.svg"} alt={"reject draw"}/>
                    <span>Reject</span>
                </button>
            </div>
        </div>
    )
}

import {useContext, useEffect, useRef, useState} from "react";
import {GlobalContext, LevelToCoinsChallenge, postRequest} from "../../Global";
import styles from "./DailyChallenge.module.scss";
import {useNavigate} from "react-router-dom";
import {useQuery} from "react-query";

type Props = {
    close: () => void;
}

export default function DailyChallenge(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [dateString, setDateString] = useState("");
    const navigate = useNavigate();
    const globalContext = useContext(GlobalContext);
    const challengesData = useQuery(["getDailyChallenges", new Date().toLocaleDateString("en-IL")], () => postRequest("/general/getDailyChallenges", {}));

    const questions = challengesData?.data || {
        easy: "",
        medium: "",
        hard: ""
    };

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    const getDateString = () => {
        const date = new Date();
        const localeDate = date.toLocaleDateString("en-IL");
        const localeTime = date.toLocaleTimeString("en-IL");
        return `${localeDate} | ${localeTime}`;
    }

    useEffect(() => {
        setDateString(getDateString());

        const interval = setInterval(() => {
            setDateString(getDateString());
        }, 1000);
        return () => clearInterval(interval);
    }, [])

    const takeTheChallenge = (level: string) => {
        window.location.href = `/challenge/${level}`
    }

    const dailyChallengeData = globalContext.challenges[new Date().toLocaleDateString("en-IL").replaceAll("/", "-")] || {};

    const title = (text: string) => {
        text = text.replaceAll("_", " ");
        if (!text) return "";
        return text[0].toUpperCase() + text.slice(1);
    }

    const compareLevels = (a: string, b: string) => {
        const levels = ["easy", "medium", "hard"];
        return levels.indexOf(a) - levels.indexOf(b);
    }

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            <div className={styles.container}>
                <button onClick={props.close} className={styles.close}>
                    <img src={"/images/x.png"} alt={"close dialog"}/>
                </button>

                <div className={styles.title}>
                    <h2>Daily Challenge</h2>
                    <img src={"/images/challenge.png"} alt={"Challenge icon"}/>
                </div>

                <span className={styles.date}>{dateString || getDateString()}</span>

                <div className={styles.challengeContainer}>
                    {Object.keys(questions).sort(compareLevels).map((level, index) => {
                        return <div className={styles.challenge} key={index}>
                            <div>
                                <span><b>{LevelToCoinsChallenge[level]} coins</b> ({title(questions[level])})</span>
                                {dailyChallengeData[level] && <img src={"/images/complete.png"} alt={"completed"}/>}
                                {!dailyChallengeData[level] && <img src={"/images/uncomplete.png"} alt={"completed"}/>}
                            </div>
                            <button className={styles[level]} onClick={() => takeTheChallenge(level)} disabled={dailyChallengeData[level]}>
                                <span>{title(level)} Challenge</span>
                                {dailyChallengeData[level] && <img src={"/images/vi.svg"} className={"checkmark"} alt={"checkmark"}/>}
                            </button>
                        </div>
                    })}
                </div>

            </div>
        </dialog>
  );
}

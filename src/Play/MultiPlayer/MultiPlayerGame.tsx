import {PlayersData} from "../../DataTypes";
import {useContext, useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {db} from "../../init/firebase";
import {GlobalContext, postRequest} from "../../Global";
import Question from "../../CommonComponents/Question/Question";
import styles from "./multiPlayerGame.module.scss";
import SeekBarMultiPlayer from "../../CommonComponents/SeekBar/SeekBarMultiPlayer";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


type Props = {
    code: string;
    questions: string[];
    level: string;
    players: PlayersData;
    numberOfQuestions: number;
}

const NumToWord = {
    1: "first",
    2: "second",
    3: "third",
    4: "fourth",
    5: "fifth",
    6: "sixth",
    7: "seventh",
    8: "eighth",
    9: "ninth",
}

export default function MultiPlayerGame(props: Props) {
    const globalContext = useContext(GlobalContext);
    const [playersData, setPlayersData] = useState<PlayersData>(props.players);
    const [inTransition, setInTransition] = useState(false);
    const [coins, setCoins] = useState(0);

    const notify = (text: string) => toast.info(text);

    useEffect(() => {
        const groupRef = ref(db,  `multi-play/${props.code}/players`);
        const listener = onValue(groupRef, (snap) => {
            if (snap.exists()) {
                const data = snap.val() as PlayersData;

                setPlayersData((lastPlayersData) => {
                    for (let playerName in data) {
                        const currentQuestion = data[playerName].currentQuestion;
                        const lastQuestion = lastPlayersData[playerName].currentQuestion;
                        if (currentQuestion !== lastQuestion && playerName !== globalContext.username) {
                            notify(`${playerName} moved to the ${NumToWord[currentQuestion + 1]} question`);
                        }
                    }
                    return data;
                });
            }
        });
        return () => listener();
    }, [props.code, globalContext.username])


    const onCorrectAnswer = async () => {
        const res = await postRequest("/multi-play/onAnswerSuccess", {
            name: globalContext.username,
            code: props.code,
        }) as {result: string, coins: number | null};

        if (res.coins) {
            setCoins(res.coins);
        }

        if (res.result === "OK") {
            setInTransition(true);
            setTimeout(() => {
                setInTransition(false);
            }, 3000);
        }
    }

    const arr = Object.keys(playersData).map((playerName) => {
        return {
            name: playerName,
            image: playersData[playerName].image,
            time: playersData[playerName].time,
        }
    }).filter((player) => player.time !== undefined);


    const winners = arr.sort((a, b) => a.time - b.time);
    if (winners.length < 3) {
        for (let i = winners.length; i < 3; i++) {
            winners.push({name: null, time: null, image: null});
        }
    }

    return (
        <div>
            {props.numberOfQuestions > playersData[globalContext.userData.name].currentQuestion ? <>
                {!inTransition && <Question funcName={props.questions[playersData[globalContext.username].currentQuestion]}
                                            onCorrectAnswer={onCorrectAnswer}
                />}

                {inTransition && <div className={styles.wonLoadingScreen}>
                    <h3>You answer correctly!<br/>
                        You have two more questions remaining</h3>
                    <img src={"/images/timer.gif"} alt={"timer"}/>
                </div>}

                <SeekBarMultiPlayer steps={props.numberOfQuestions}
                                    currentStep={playersData[globalContext.username].currentQuestion}
                                    playersData={playersData}/>

            </> :

                <div className={styles.finishContainer}>

                    <div>

                    </div>
                    <div className={styles.coins}>
                        <span className={styles.coinsAdded}>Coins:&nbsp;&nbsp;+{coins}</span>
                        <img src={"/images/coin.png"} alt={"coins"}/>
                    </div>
                    <h2>You finished the game in the {NumToWord[winners.map((player) => player.name).indexOf(globalContext.userData.name) + 1]} place!</h2>

                    <div className={styles.podium}>
                        {winners.map((player, index) => {
                            return (
                                <div key={index}>
                                    <div>
                                        {player.image && <img src={`/images/p${player.image}.png`} alt={"profile"}/>}
                                        {player.name && <span>{player.name.replaceAll("_", "")}</span>}
                                    </div>
                                    <span>{index + 1}</span>
                                    <span>{player.time}</span>
                                </div>
                            )
                        })}
                    </div>

                    <div className={styles.buttonContainer}>
                        <button>Go Home</button>
                        <button>Play Again</button>
                    </div>

                </div>}
        </div>
    )
}

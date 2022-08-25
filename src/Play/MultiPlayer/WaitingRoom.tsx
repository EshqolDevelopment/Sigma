import styles from "./waitingRoom.module.scss";
import React, {useEffect} from "react";
import {ref, onValue} from "firebase/database";
import {db} from "../../init/firebase";
import {PlayersData} from "../../DataTypes";
import { GlobalContext, postRequest} from "../../Global";
import SelectQuestionsNum from "./SelectQuestionsNum/SelectQuestionsNum";


type Props = {
    code: string;
    admin: boolean;
    setGameStart: (gameStart: boolean) => void;
    setLevel: (level: string) => void;
    setQuestions: (questions: string[]) => void;
    setPlayers: (players: PlayersData) => void;
    players: PlayersData;
    questions: string[];
    level: string;
    setNumberOfQuestions: (numberOfQuestions: number) => void;
}

export default function WaitingRoom(props: Props) {
    const globalContext = React.useContext(GlobalContext);
    const isHost = true;

    useEffect(() => {
        const groupRef = ref(db,  `multi-play/${props.code}`);
        const listener = onValue(groupRef, (snap) => {
            const data = snap.val() as {
                level: string;
                players: PlayersData;
                questions: string;
                startTime: number;
                finishTime: number;
                closed: boolean;
                numberOfQuestions: number;
            }

            props.setLevel(data.level)
            props.setQuestions(JSON.parse(data.questions))
            props.setPlayers(data.players)
            props.setNumberOfQuestions(data.numberOfQuestions)

            if (data.startTime) {
                props.setGameStart(true);
            }
        })

        return () => listener();
    }, [props.code])


    const startPlaying = async (numberOfQuestions: number) => {
        const res = await postRequest("/multi-play/startGame", {
            name: globalContext.username,
            code: props.code,
            numberOfQuestions: numberOfQuestions,
        });
    }


    return (
        <div>
            <div className={styles.upper}>
                <div className={styles.title}>
                    <h1>Waiting room</h1>
                    <div>
                        <span>
                            {
                                isHost ?
                                    `As the host you can start the game when everyone is ready, 
                            in the meantime you can modify the number of questions and the time factor.` :
                                    `Please be patient while the host starts the game, you can invite other players to join the game.`
                            }
                            <br/>
                            <br/>
                        </span>

                        <span>
                             Level: {props.level}<br/>
                             Number of questions: {props.questions.length}<br/>
                            {Object.keys(props.players).length} players have joined the game so far.
                        </span>
                    </div>
                </div>
            </div>


            <div className={styles.playersContainer}>
                <span>{props.code}</span>

                {Object.keys(props.players).map((playerName, index) => {
                    const player = props.players[playerName];
                    return <div key={index} className={styles.playerRow}>
                        <div>
                            <span>Player {index + 1}</span>
                            <span>{playerName}</span>
                            <span>{player.score}</span>
                        </div>

                        <div className={styles.rightSide}>
                            {player.admin &&
                                <img src={'https://iconarchive.com/download/i103432/paomedia/small-n-flat/key.ico'}
                                     alt={'Admin'}/>}
                            <img src={`/images/p${player.image}.png`}/>
                        </div>
                    </div>
                })}

                {props.admin && <div className={styles.selectQuestionsNum}>
                    <SelectQuestionsNum onSubmit={startPlaying}/>
                </div>}
            </div>
        </div>
    )
}

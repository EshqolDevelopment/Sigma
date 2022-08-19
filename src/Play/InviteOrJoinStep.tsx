import styles from "./play.module.scss";
import {Levels} from "./Levels";
import React, {useState} from "react";

type Props = {
    moveToWaitingRoom: () => void;
}

export function InviteOrJoinStep(props: Props) {

    const [code, setCode] = useState("");


    const createGame = (e) => {
        e.preventDefault()
        props.moveToWaitingRoom();
    }


    return <div className={styles.chooseLevelContainer}>

        <div className={styles.upper}>
            <div className={[styles.title, styles.inviteOrJoinTitle].join(" ")}>
                <h1>Play with friend</h1>
                <p>
                    Join a game with your friends or create a new game and invite your friends.
                    <br/>
                    You can invite up to 5 friends to play with you.
                </p>
            </div>
        </div>


        <div className={styles.inviteOrJoinMainContent}>

            <div className={styles.joinContainer}>
                <h3>Join a game</h3>
                <form onSubmit={createGame}>
                    <span>Enter the code you received from your friend</span>
                    <input value={code} onChange={(text) => setCode(text.target.value)} type={"text"} placeholder={"Enter your invitation code"} name={"code"}/>
                    <button className={"sigma-button"} disabled={code.length === 0}>Join</button>
                </form>
            </div>

            <div className={styles.border}/>

            <div className={styles.inviteContainer}>
                <h3>Invite your friends</h3>
                <Levels shortVersion={true}/>
            </div>


        </div>

    </div>;
}

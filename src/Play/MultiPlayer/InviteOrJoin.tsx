import React, {useState} from "react";
import styles from "../Setup/play.module.scss";
import {Levels} from "../Setup/Levels";
import {GlobalContext, postRequest} from "../../Global";


type Props = {
    onSubmit: (code: string) => void;
    setAdmin: (admin: boolean) => void;
}

export function InviteOrJoin(props: Props) {
    const globalContext = React.useContext(GlobalContext);
    const [codeForGui, setCodeForGui] = useState("");


    const joinGame = async (e) => {
        e.preventDefault();
        const res = await postRequest("/multi-play/joinRoom", {
            name: globalContext.userName,
            code: codeForGui,
            score: 100
        });

        if (res.result === "OK") {
            props.setAdmin(false);
            props.onSubmit(codeForGui);
        }
    };

    const createPlayingRoom = async (level) => {
        const res = await postRequest("/multi-play/createRoom", {
            level: level,
            name: globalContext.userName,
            score: 100,
        })
        props.setAdmin(true);
        props.onSubmit(res.roomCode);
    }

    return <div className={styles.chooseLevelContainer}>
        <div className={styles.upper}>
            <div className={[styles.title, styles.inviteOrJoinTitle].join(" ")}>
                <h1>Play with your friends</h1>
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
                <form onSubmit={joinGame}>
                    <span>Enter the code you received from your friend</span>
                    <input value={codeForGui} onChange={(e) => setCodeForGui(e.target.value)} type={"text"}
                           placeholder={"Enter your invitation code"} name={"code"}/>
                    <button className={"sigma-button"} disabled={codeForGui.length === 0}>Join</button>
                </form>
            </div>

            <div className={styles.border}/>

            <div className={styles.inviteContainer}>
                <h3>Invite your friends</h3>
                <Levels shortVersion={true} onClick={createPlayingRoom}/>
            </div>
        </div>
    </div>
}

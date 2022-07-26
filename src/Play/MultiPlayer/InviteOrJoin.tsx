import React, {useState} from "react";
import styles from "../Setup/play.module.scss";
import {Levels} from "../Setup/Levels";
import {GlobalContext, postRequest} from "../../Global";
import LoginModal from "../../Authentication/LoginModal";

type Props = {
    onSubmit: (code: string) => void;
    setAdmin: (admin: boolean) => void;
}

export function InviteOrJoin(props: Props) {
    const globalContext = React.useContext(GlobalContext);
    const [codeForGui, setCodeForGui] = useState("");
    const [showLogin, setShowLogin] = useState(false);


    const joinGame = async (force?: boolean) => {
        if (globalContext.username || force) {
            const res = await postRequest("/multi-play/joinRoom", {
                name: globalContext.username,
                code: codeForGui,
                score: 100,
                image: globalContext.userData.image
            }) as {result: string};

            if (res.result === "OK") {
                props.setAdmin(false);
                props.onSubmit(codeForGui);
            } else {
                globalContext.showToast("We couldn't find a room with this code", "error");
            }
        } else {
            setShowLogin(true);
        }
    };

    const createPlayingRoom = async (level) => {
        const res = await postRequest("/multi-play/createRoom", {
            level: level,
            name: globalContext.username,
            score: 100,
            image: globalContext.userData.image
        }) as {roomCode: string};
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
                <form onSubmit={(e) => {
                    e.preventDefault();
                    joinGame();
                }}>
                    <span>Enter the code you received from your friend</span>
                    <input maxLength={8} value={codeForGui} onChange={(e) => setCodeForGui(e.target.value)} type={"text"}
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

        <LoginModal show={showLogin} setShow={setShowLogin} onLogin={() => joinGame(true)}/>
    </div>
}

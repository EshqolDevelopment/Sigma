import styles from "./play.module.scss";
import {Levels} from "./Levels";
import React from "react";

export function InviteOrJoinStep() {

    const createGame = () => {

    }

    return <div className={styles.chooseLevelContainer}>

        <div className={styles.upper}>
            <div className={[styles.title, styles.chooseStepTitle].join(" ")}>
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
                    <input type={"text"} placeholder={"Enter your invitation code"}/>

                    <button className={"sigma-button"}>Join</button>
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

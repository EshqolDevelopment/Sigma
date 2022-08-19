import styles from "./play.module.scss";
import React from "react";


type Props = {
    quickPlay: () => void;
    multiPlay: () => void;
}


export function ChooseModeStep(props: Props) {
    return <div>
        <div className={styles.upper}>
            <div className={styles.title}>
                <h1>Choose mode</h1>
                <div>
                    Choose which mode you want to play in. <br/>
                    The modes are differ not only in the number of players but also in the style of the game.
                    <br/>
                    <br/>
                    You can choose between:
                    <ul>
                        <li>Quick play (1 vs 1)</li>
                        <li>Multi play (play with friends)</li>
                    </ul>
                </div>
            </div>
        </div>

        <h2 className={styles.subTitle}>
            Which mode would you like to play?
        </h2>

        <div className={styles.container}>
            <div>
                <h2>Quick Play</h2>
                <div className={styles.modeBody}>
                    <span>
                        Play a game a against a random opponent, with a certain time limit for each question,
                        the first one to answer each question correct score a point,<br/>
                        Win the game by scoring 3 points first!
                    </span>
                    <img src={"/images/singlePlayer.svg"}/>
                </div>

                <button onClick={props.quickPlay}>Play Now!</button>
            </div>

            <div>
                <h2>Play with Friends</h2>
                <div className={styles.modeBody}>
                    <span>
                        Multiplayer game mode where you can challenge up to 5 of your friends to a game,
                        the level and the amount of questions can be modified by the game host.
                        Unlike the quick play, here when a player answer a question correctly,
                        they move to the next one without disturbing the other ones.
                    </span>
                    <img src={"/images/multiPlayer.svg"}/>
                </div>

                <button onClick={props.multiPlay}>Play Now!</button>
            </div>
        </div>
    </div>;
}

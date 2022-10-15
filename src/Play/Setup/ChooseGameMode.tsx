import styles from "./play.module.scss";
import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet";
import Footer from "../../CommonComponents/Footer/Footer";


export function ChooseGameMode() {
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
    }, [])

    return <div>

        <Helmet>
            <title>Select Game Mode | Sigma Code Wars</title>
            <meta name={"description"} content={"Select the game mode you want to play in - quick play (1 vs 1) or multi-player."}/>
        </Helmet>

        <main>
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
                    <h2>Quick Play (1 vs 1)</h2>
                    <div className={styles.modeBody}>
                    <span>
                        Play a game a against a random opponent, with a certain time limit for each question,
                        the first one to answer each question correct score a point,<br/>
                        Win the game by scoring 3 points first!
                    </span>
                        <img src={"/images/singlePlayer.svg"} alt={"player logo"}/>
                    </div>

                    <button onClick={() => navigate("/quick-play")}>Play Now!</button>
                </div>

                <div>
                    <h2>Play with Friends</h2>
                    <div className={styles.modeBody}>
                    <span>
                        You can challenge up to 5 of your friends,
                        Unlike the quick play, here when a player answer a question correctly,
                        they move to the next one without disturbing the other ones.
                    </span>
                        <img src={"/images/multiPlayer.svg"} alt={"players logo"}/>
                    </div>

                    <button onClick={() => navigate("/multi-player")}>Play Now!</button>
                </div>

                <div>
                    <h2>Play against yourself</h2>
                    <div className={styles.modeBody}>
                    <span>
                        Play against yourself mode allows you to practice your skills and improve your knowledge,
                        in addition to that you can also see your progress and compare it to your previous results.
                    </span>
                        <img src={"/images/multiPlayer.svg"} alt={"players logo"}/>
                    </div>

                    <button onClick={() => navigate("/single-player")}>Play Now!</button>
                </div>
            </div>
        </main>

        <Footer/>

    </div>;
}

import {Bonus, QuickPlayGameData, QuickPlayGameFinished} from "../../DataTypes";
import { useContext, useEffect, useState} from "react";
import {GlobalContext} from "../../Global";
import styles from "./quickPlay.module.scss";
import {Trophy} from "../../init/Svg";

type Props = {
    score: number[];
    gameData: QuickPlayGameData;
    gameFinishedData: QuickPlayGameFinished;
}

const BonusNameToDescription = {
    [Bonus.perfectMatch]: "Perfect Match",
    [Bonus.closeMatch]: "Close Match",
    [Bonus.fasterThan70Percent]: "Faster Than 70% of players",
    [Bonus.significantAdvantage]: "Significant Advantage"
};


export function GameSummary(props: Props) {
    const globalContext = useContext(GlobalContext);
    const [coinsCount, setCoinsCount] = useState(0);

    useEffect(() => {
        let counter = 0;
        const interval = setInterval(() => {
            if (counter < props.gameFinishedData?.coins) {
                counter++;
                setCoinsCount(counter);
            } else {
                clearInterval(interval);
                return;
            }
        }, 0);
    }, [props.gameFinishedData?.coins]);

    const isWon = props.score[0] > props.score[1];
    const isLost = props.score[0] < props.score[1];

    return <div className={styles.gameSummary}>

        <div className={[styles.resultContainer, isWon ? styles.won : "", isLost ? styles.lost : "", !isLost && !isWon ? styles.draw : ""].join(" ")}>
            <div className={styles.coins}>
                <span className={styles.coinsAdded}>Coins:&nbsp;&nbsp;+{coinsCount}</span>
                <img src={"/images/coin.png"} alt={"coins"}/>
            </div>

            <h3>{isWon ? "You won the game!" : isLost ? "You lost the game!": "It's a draw!"}</h3>
            <span>Score: {props.score[0]} - {props.score[1]}</span>
            <div className={styles.playersSummaryContainer}>
                <div className={styles.playerScoreContainer}>
                    {isWon && <>
                        <Trophy/>
                        <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                    </>}
                    <img src={`/images/p${globalContext.userData.image}.png`} alt={"Your profile"}/>
                    <span>{globalContext.userData.displayName}</span>
                </div>

                <div className={styles.playerScoreContainer}>
                    {isLost && <>
                        <Trophy/>
                        <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                    </>}
                    <img src={`/images/p${props.gameData.opponent.image}.png`} alt={"Opponent profile"}/>
                    <span>{props.gameData.opponent.displayName}</span>
                </div>
            </div>

            {props.gameFinishedData?.bonuses.length > 0 && <div className={styles.bonuses}>
                <h3>Bonuses</h3>
                {props.gameFinishedData?.bonuses.map((bonus, index) => {
                    return (
                        <div key={index} className={styles.bonus}>
                            <span className={styles.bonusDesc}>{BonusNameToDescription[bonus.name]}:</span>
                            <span className={styles.bonusAmount}>+{bonus.amount}</span>
                            <img src={"/images/coin.png"} alt={"coins"}/>
                        </div>
                    );
                })}
            </div>}

            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Go Home</button>
            <button className={["sigma-button", styles.summaryBtn].join(" ")}>Play Again</button>
        </div>

    </div>;
}

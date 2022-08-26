import {Bonus, QuickPlayGameData, QuickPlayGameFinished} from "../../DataTypes";
import {useContext} from "react";
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
    [Bonus.significantAdvantage]: "Significant Advantage",
}

export function GameSummary(props: Props) {
    const globalContext = useContext(GlobalContext);

    return <div className={styles.gameSummary}>
        <div className={styles.coins}>
            <span className={styles.coinsAdded}>Coins:&nbsp;&nbsp;+{props.gameFinishedData?.coins}</span>
            <img src={"/images/coin.png"}/>
        </div>
        <h3>{props.score[0] > props.score[1] ? "You won the game!" : "You lost the game!"}</h3>
        <span>Score: {props.score[0]} - {props.score[1]}</span>
        <div className={styles.playersSummaryContainer}>
            <div className={styles.playerScoreContainer}>
                {props.score[0] > props.score[1] && <>
                    <Trophy/>
                    <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                </>}
                <img src={`/images/p${globalContext.userData.image}.png`} alt={"Your profile"}/>
                <span>{globalContext.username}</span>
            </div>

            <div className={styles.playerScoreContainer}>
                {props.score[1] > props.score[0] && <>
                    <Trophy/>
                    <img className={styles.crown} src={"/images/crown.png"} alt={"crown"}/>
                </>}
                <img src={`/images/p${props.gameData.opponent.image}.png`} alt={"Opponent profile"}/>
                <span>{props.gameData.opponent.name}</span>
            </div>
        </div>

        {props.gameFinishedData?.bonuses.length > 0 && <div className={styles.bonuses}>
            <h3>Bonuses</h3>
            {props.gameFinishedData?.bonuses.map((bonus, index) => {
                return (
                    <div key={index} className={styles.bonus}>
                        <span className={styles.bonusDesc}>{BonusNameToDescription[bonus.name]}:</span>
                        <span className={styles.bonusAmount}>+{bonus.amount}</span>
                        <img src={"/images/coin.png"}/>
                    </div>
                )
            })}
        </div>}

        <button className={["sigma-button", styles.summaryBtn].join(" ")}>Go Home</button>
        <button className={["sigma-button", styles.summaryBtn].join(" ")}>Play Again</button>
    </div>;
}

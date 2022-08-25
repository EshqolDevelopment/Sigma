import {UserData} from "../../DataTypes";
import React, {useContext} from "react";
import {GlobalContext, winRate} from "../../Global";
import styles from "./matchScreen.module.scss";
import {countryCodeEmoji} from "country-code-emoji";

type Props = {
    opponent: UserData;
}

export default function MatchScreen(props: Props) {
    const globalContext = useContext(GlobalContext);

    return (
        <div className={styles.matchScreen}>
            <div>
                <span className={styles.flag}>{countryCodeEmoji(globalContext.userData.countryCode)}</span>
                <img className={styles.profile} src={`/images/p${globalContext.userData.image}.png`}/>
                <span className={styles.name}>{globalContext.userData.displayName}</span>
                <div className={styles.coinsContainer}>
                    <img src={"/images/coins.png"}/>
                    <span className={styles.coins}>{globalContext.userData.coins}</span>
                </div>
                <div className={styles.rateContainer}>
                    <img src={"/images/rate.png"}/>
                    <span className={styles.winRate}>{winRate(globalContext.userData)} %</span>
                </div>
            </div>

            <div className={styles.vsLine}>
                <div/>
                <img src={"/images/vs_circle.png"}/>
                <div/>
            </div>
            <img src={"/images/vs.png"} className={styles.vs}/>

            <div>
                <span className={styles.flag}>{countryCodeEmoji(props.opponent.countryCode)}</span>
                <img className={styles.profile} src={`/images/p${props.opponent.image}.png`}/>
                <span className={styles.name}>{props.opponent.displayName}</span>
                <div className={styles.coinsContainer}>
                    <span>{props.opponent.coins}</span>
                    <img src={"/images/coins.png"}/>
                </div>
                <div className={styles.rateContainer}>
                    <span>{winRate(props.opponent)} %</span>
                    <img src={"/images/rate.png"}/>
                </div>
            </div>
        </div>
    )
}

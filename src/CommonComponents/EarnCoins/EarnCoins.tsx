import {useEffect, useRef, useState} from "react";
import styles from "./EarnCoins.module.scss";
import BuyCoins from "../BuyCoins/BuyCoins";
import DailyChallenge from "../../DailyChallenge/DailyChallenge";

type Props = {
    close: () => void;
}

export default function EarnCoins(props: Props) {
    const [dialogToShow, setDialogToShow] = useState("selector");
    const dialogRef = useRef<HTMLDialogElement>(null);


    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, [dialogToShow]);

    return (
        <>
            {dialogToShow === "selector" && <dialog ref={dialogRef} className={styles.dialog}>
                <button onClick={props.close} className={"removeDefault " + styles.close}>
                    <img src={"/images/x.png"} alt={"close dialog"}/>
                </button>

                <span className={styles.title}>Earn Coins</span>

                <div className={styles.challengeContainer}>
                    <div className={styles.challenge}>
                        <span className={styles.subtitle}>Complete the daily challenge to earn 100 coins</span>

                        <div>
                            <img src={"/images/challenge.png"}/>
                            <button onClick={() => setDialogToShow("challenge")}>Daily Challenge ({new Date().toLocaleDateString("en-IL")})</button>
                        </div>
                    </div>

                    <div className={styles.challenge}>
                        <span className={styles.subtitle}>Buy coins from the shop</span>

                        <div>
                            <img src={"/images/coins_2.png"}/>
                            <button onClick={() => setDialogToShow("shop")}>Coins Shop</button>
                        </div>
                    </div>
                </div>

            </dialog>}

            {dialogToShow === "shop" && <BuyCoins close={props.close}/>}
            {dialogToShow === "challenge" && <DailyChallenge close={props.close}/>}
        </>

    )
}

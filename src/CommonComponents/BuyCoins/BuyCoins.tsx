import {useContext, useEffect, useRef, useState} from "react";
import styles from "./buyCoins.module.scss";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import {GlobalContext, postRequest} from "../../Global";

type Props = {
    close: () => void;
}

export default function BuyCoins(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [amount, setAmount] = useState(null);
    const globalContext = useContext(GlobalContext);


    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog ref={dialogRef} className={styles.dialog}>
            {!amount && <div className={styles.container}>
                <button onClick={props.close} className={"removeDefault " + styles.close}>
                    <img src={"/images/x.png"} alt={"close dialog"}/>
                </button>
                <h3>Shop Coins</h3>

                <div className={styles.shopOptions}>
                    <div>
                        <span>1,000</span>
                        <img src={"/images/coin.png"} alt={"coins"}/>
                        <button onClick={() => setAmount([0.99, "1,000"])}>$0.99</button>
                    </div>
                    <div>
                        <span>5,000</span>
                        <img src={"/images/coins_1.png"} alt={"coins"}/>
                        <button onClick={() => setAmount([2.99, "5,000"])}>$2.99</button>
                    </div>
                    <div>
                        <span>10,000</span>
                        <img src={"/images/coins_2.png"} alt={"coins"}/>
                        <button onClick={() => setAmount([4.99, "10,000"])}>$4.99</button>
                    </div>
                </div>
            </div>}

            {!!amount && <div className={styles.payContainer}>
                <button className={"removeDefault " + styles.back} onClick={() => setAmount(null)}>
                    <img src={"/images/back.png"} alt={"coins"}/>
                </button>
                <h3>Buy {amount[1]} coins</h3>
                <span>(Equal to {Math.floor(amount[1].replaceAll(",", "") / 300)} game in the medium level)</span>
                <span>You will be charged ${amount[0]}</span>

                <PayPalScriptProvider options={{"client-id": "test", currency: "USD"}}>
                    <PayPalButtons
                        style={{layout: "horizontal", color: "gold", label: "pay", shape: "rect"}}
                        createOrder={(data, actions) => {
                            return actions.order.create({
                                purchase_units: [
                                    {
                                        amount: {
                                            value: amount[0]
                                        }
                                    }
                                ]
                            });
                        }}
                        onApprove={(data, actions) => {
                            return actions.order.capture().then(() => {
                                postRequest("/general/buyCoins", {
                                    name: globalContext.userData.name,
                                    amount: amount[1]
                                });
                            });
                        }}

                    />
                </PayPalScriptProvider>

            </div>}


        </dialog>
    );
};

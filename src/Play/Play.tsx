import React, {useEffect, useState} from "react";
import {ChooseModeStep} from "./ChooseModeStep";
import {ChooseLevelStep} from "./ChooseLevelStep";
import {InviteOrJoinStep} from "./InviteOrJoinStep";
import styles from "./play.module.scss";
import WaitingRoom from "./WaitingRoom";

export default function Play() {
    const [gameMode, setGameMode] = useState<"SinglePlayer" | "MultiPlayer">(null);
    const [step, setStep] = useState(0);


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#cdced2");
    }, []);


    const quickPlay = () => {
        setGameMode("SinglePlayer");
        setStep(1);
    };

    const multiPlay = () => {
        setGameMode("MultiPlayer");
        setStep(1);
    };

    const moveToWaitingRoom = () => {
        setStep(2);
    }


    return (
        <div className={styles.stepsContainer}>
            {step === 0 &&
                <ChooseModeStep
                    quickPlay={quickPlay}
                    multiPlay={multiPlay}
                />
            }
            {step === 1 && gameMode === "SinglePlayer" &&
                <ChooseLevelStep/>
            }

            {step === 1 && gameMode === "MultiPlayer" &&
                <InviteOrJoinStep
                    moveToWaitingRoom={moveToWaitingRoom}
                />
            }
            {step === 2 && gameMode === "MultiPlayer" &&
                <WaitingRoom code={"123931"}/>
            }

            {step === 3 && gameMode === "SinglePlayer" &&
                <div>
                    <h1>Single Player</h1>
                </div>
            }

        </div>
    );
}

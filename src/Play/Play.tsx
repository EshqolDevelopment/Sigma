import React, {useEffect, useState} from "react";
import {ChooseModeStep} from "./ChooseModeStep";
import {SinglePlayer} from "./SinglePlayer";
import {MultiPlayer} from "./MultiPlayer";
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


    return (
        <div className={styles.stepsContainer}>
            {!gameMode &&
                <ChooseModeStep
                    quickPlay={quickPlay}
                    multiPlay={multiPlay}
                />
            }
            {gameMode === "SinglePlayer" &&
                <SinglePlayer/>
            }

            {gameMode === "MultiPlayer" &&
                <MultiPlayer/>
            }

        </div>
    );
}

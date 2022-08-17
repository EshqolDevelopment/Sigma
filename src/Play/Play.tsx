import React, {useEffect, useState} from "react";
import {ChooseModeStep} from "./ChooseModeStep";
import {ChooseLevelStep} from "./ChooseLevelStep";

export default function Play() {

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#cdced2");
    }, [])

    const [gameMode, setGameMode] = useState<"SinglePlayer" | "MultiPlayer">(null);
    const [step, setStep] = useState(0);

    const quickPlay = () => {
        setGameMode("SinglePlayer");
        setStep(1);
    }

    const multiPlay = () => {
        setGameMode("MultiPlayer");
        setStep(1);
    }

    return (
        <div>
            { step === 0 && <ChooseModeStep quickPlay={quickPlay} multiPlay={multiPlay}/> }

            { step === 1 && gameMode === "SinglePlayer" && <ChooseLevelStep/>}
        </div>
    )
}

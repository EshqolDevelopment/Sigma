import React, {useEffect, useState} from "react";
import {ChooseModeStep} from "./ChooseModeStep";
import {ChooseLevelStep} from "./ChooseLevelStep";
import {InviteOrJoinStep} from "./InviteOrJoinStep";

export default function Play() {

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#cdced2");
    }, []);

    const [gameMode, setGameMode] = useState<"SinglePlayer" | "MultiPlayer">(null);
    const [step, setStep] = useState(0);

    const quickPlay = () => {
        setGameMode("SinglePlayer");
        setStep(1);
    };

    const multiPlay = () => {
        setGameMode("MultiPlayer");
        setStep(1);
    };

    useEffect(() => {
        // when the user clicks on the back button, we reset the step to 0
        window.onpopstate = () => {
            if (step > 0) {
                setStep(0);
            } else {
                window.location.href = "/";
            }
        };
    }, [step]);

    useEffect(() => {
        window.history.pushState(null, null, window.location.pathname);
    }, []);

    return (
        <div>
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
                <InviteOrJoinStep/>
            }


        </div>
    );
}

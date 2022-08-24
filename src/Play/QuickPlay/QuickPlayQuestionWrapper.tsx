import DrawDecisionDialog from "./DrawDesicionDialog";
import {toast, ToastContainer} from "react-toastify";
import Question from "../../CommonComponents/Question/Question";
import {useContext, useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";
import {db} from "../../init/firebase";
import {GlobalContext, postRequest} from "../../Global";
import {QuickPlayGameData} from "../../DataTypes";

type DrawData = {
    name?: string;
    response?: "accepted" | "rejected" | "waiting";
}

type Props = {
    gameData: QuickPlayGameData;
    questionNumber: number;
    won: () => void;
    lost: () => void;
    draw: () => void;
}

export default function QuickPlayQuestionWrapper(props: Props) {
    const [waitingForDrawDecision, setWaitingForDrawDecision] = useState(false);
    const [alreadyOfferedDraw, setAlreadyOfferedDraw] = useState(false);
    const globalContext = useContext(GlobalContext);


    useEffect(() => {
        const winnerRef = ref(db, `quick-play/${props.gameData.gameCode}/winner${props.questionNumber}`);
        const drawRef = ref(db, `quick-play/${props.gameData.gameCode}/draw${props.questionNumber}`);
        const winnerListener = onValue(winnerRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                if (data === globalContext.username) {
                    props.won();
                } else if (data === "draw") {
                    props.draw();
                } else {
                    props.lost();
                }
            }
        });

        const waitForDrawResponse = new Promise((resolve, reject) => {
            const drawListener = onValue(drawRef, (snapshot) => {
                if (snapshot.exists()) {
                    const data = snapshot.val() as DrawData;
                    if (data.name === globalContext.username) {
                        if (data.response === "accepted") {
                            resolve("offer accepted");
                        } else if (data.response === "rejected") {
                            reject("offer rejected");
                        }
                    }

                }
            });
            return () => drawListener();
        });

        const drawListener = onValue(drawRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val() as DrawData;
                if (data.name === globalContext.username && data.response === "waiting") {
                    toast.promise(waitForDrawResponse, {
                        pending: 'Waiting for response from your opponent',
                        success: 'Your opponent accepted your draw offer',
                        error: 'Your opponent rejected your draw offer',
                    })
                } else if (data.response === "waiting") {
                    setWaitingForDrawDecision(true);
                } else {
                    setWaitingForDrawDecision(false);
                }
            }
        });

        return () => {
            winnerListener();
            drawListener();
        };

    }, [props.questionNumber, props.gameData]);


    const onCorrectAnswer = async () => {
        await postRequest("/quick-play/onAnswerSuccess", {
            name: globalContext.username,
            gameCode: props.gameData.gameCode,
            questionNumber: props.questionNumber
        }).catch(() => toast.error("Something went wrong"));
    };

    const suggestDraw = async () => {
        setAlreadyOfferedDraw(true);
        try {
            await postRequest("/quick-play/suggestDraw", {
                name: globalContext.username,
                gameCode: props.gameData.gameCode,
                questionNumber: props.questionNumber
            });
        } catch (e) {
            setAlreadyOfferedDraw(false);
            toast.error("Something went wrong");
        }

    };

    const answerDraw = async (accept: boolean) => {
        await postRequest("/quick-play/drawAnswer", {
            name: globalContext.username,
            gameCode: props.gameData.gameCode,
            questionNumber: props.questionNumber,
            accept: accept
        }).catch(() => toast.error("Something went wrong"));
    }

    return (
        <div>
            <Question funcName={props.gameData.questions[props.questionNumber]}
                      numberOfQuestions={props.gameData.questions.length}
                      currentQuestionNum={props.questionNumber}
                      onCorrectAnswer={onCorrectAnswer}
                      suggestDrawAction={suggestDraw}
                      alreadyOfferedDraw={alreadyOfferedDraw}
            />

            {waitingForDrawDecision && <DrawDecisionDialog
                opponentName={props.gameData.opponentName}
                onAccept={() => answerDraw(true) }
                onDecline={() => answerDraw(false)}
            />}

            <ToastContainer />
        </div>
    )

}

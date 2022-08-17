import React, {useEffect, useRef, useState} from "react";

export function QuickPlayModal(props) {
    const [level, setLevel] = useState("");
    const [title, setTitle] = useState("Choose a difficulty level");
    const [opponentName, setOpponentName] = useState("Opponent");
    const [opponentProfileImage, setOpponentProfileImage] = useState("");
    const [opponentCoinsNum, setOpponentCoinsNum] = useState(0);

    useEffect(() => {
        searchingOpponent();
    }, [])


    function searchingOpponent() {
        setInterval(async () => {
            const randProfile = Math.floor(Math.random() * 8) + 1;
            setOpponentProfileImage(`/images/p${randProfile}.png`)
        }, 300);
    }

    function startPlayEasy() {
        setLevel("easy");
        setTitle("Searching for opponent...");
    }

    function startPlayMedium() {
        setLevel("medium");
        setTitle("Searching for opponent...");
    }

    function startPlayHard() {
        setLevel("hard");
        setTitle("Searching for opponent...");
    }


    return (
        <>
            <div className={"container-modal"}>
                <div className={"modal-header"}>
                    <img src={"https://static.thenounproject.com/png/57781-200.png"} onClick={() => props.setShow(false)}/>
                    <h3>{title}</h3>
                </div>

                {!level && <div className={"quick-play-container"}>
                    <button onClick={startPlayEasy}>Easy</button>
                    <div/>
                    <button onClick={startPlayMedium}>Medium</button>
                    <div/>
                    <button onClick={startPlayHard}>Hard</button>
                </div>}

                {level && <div className={"match-outside-container"}>
                    <div className={"match-container"}>
                        <div>
                            <span>UserName1</span>
                            <img src={"/images/p1.png"}/>

                            <div className={"points-container"}>
                                <img src={"https://cdn-icons-png.flaticon.com/512/272/272525.png"}/>
                                <span>5000</span>
                            </div>
                        </div>
                        <img src={"/images/vs.png"}/>
                        <div>
                            <span>{opponentName}</span>
                            <img src={opponentProfileImage}/>

                            <div className={"points-container"}>
                                <img src={"https://cdn-icons-png.flaticon.com/512/272/272525.png"}/>
                                <span>{opponentCoinsNum}</span>
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
        </>
    )
}

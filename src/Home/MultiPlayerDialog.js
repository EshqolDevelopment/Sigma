import React, {useEffect, useRef, useState} from "react";

export function MultiPlayerModal(props) {
    const multiPlayDialog = useRef();
    const [title, setTitle] = useState("Play with friends");
    const [invite, setInvite] = useState(false);
    const [code, setCode] = useState("");
    const [playersList, setPlayersList] = useState([
        {name: "UserName", profileImage: "1", coinsNum: 0},
        {name: "Nadav1", profileImage: "1", coinsNum: 100}
        , {}, {}, {}]);



    function joinAction(e) {
        e.preventDefault();
        setCode(e.target[0].value);
    }

    function inviteAction() {
        setTitle("Choose a difficulty level");
        setInvite(true);
    }

    function easyCode() {
        setCode("11111");
    }

    function mediumCode() {
        setCode("333333");
    }

    function hardCode() {
        setCode("666666");
    }

    return (
        <>
            <div className={"container-modal"}>
                <div className={"modal-header"}>
                    <img src={"https://static.thenounproject.com/png/57781-200.png"}
                         onClick={() => props.setShow(false)}/>
                    <h3>{code || title}</h3>
                </div>

                {!code && !invite && <form className={"multi-play-container"} onSubmit={joinAction}>
                    <span>Invitation Code</span>
                    <input required={true} type={"text"} placeholder={"Write your invitation code here"}/>
                    <div className={"multi-play-buttons-container"}>
                        <button type={"submit"}>Join</button>
                        <button type={"button"} onClick={inviteAction}>Invite</button>
                    </div>
                </form>}

                {code && <div className={"waiting-room"}>
                    <div className={"players-list"}>
                        {playersList.map((player, index) => {
                            return <div key={index} className={"player-item"}>
                                <span className={"player-item-index"}>Player {index + 1}</span>
                                <span className={"player-item-name"}>{player.name}</span>
                                {player.profileImage && <img src={`/images/p${player.profileImage}.png`}/>}
                            </div>
                        })}
                    </div>

                    <span>Choose the number of questions</span>
                    <div className={"question-num"}>
                        <div>
                            <label>1</label>
                            <input type={"radio"} name={"num"}/>
                        </div>
                        <div>
                            <label>2</label>
                            <input type={"radio"} name={"num"}/>
                        </div>
                        <div>
                            <label>3</label>
                            <input type={"radio"} name={"num"} defaultChecked={true}/>
                        </div>
                        <div>
                            <label>4</label>
                            <input type={"radio"} name={"num"}/>
                        </div>
                        <div>
                            <label>5</label>
                            <input type={"radio"} name={"num"}/>
                        </div>
                    </div>

                    <button>Start Playing!</button>

                </div>}

                {invite && !code && <div className={"invite-container"}>
                    <div className={"quick-play-container"}>
                        <button onClick={easyCode}>Easy</button>
                        <div/>
                        <button onClick={mediumCode}>Medium</button>
                        <div/>
                        <button onClick={hardCode}>Hard</button>
                    </div>

                </div>}


            </div>
        </>
    );
}

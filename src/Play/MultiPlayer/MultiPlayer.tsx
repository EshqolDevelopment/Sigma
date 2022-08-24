import React, {useContext, useEffect, useState} from "react";
import WaitingRoom from "./WaitingRoom";
import {InviteOrJoin} from "./InviteOrJoin";
import {useNavigate} from "react-router-dom";
import {GlobalContext, postRequest} from "../../Global";
import MultiPlayerGame from "./MultiPlayerGame";
import {PlayersData} from "../../DataTypes";


export default function MultiPlayer() {
    const globalContext = useContext(GlobalContext);
    const [code, setCode] = useState("");
    const [admin, setAdmin] = useState(false);
    const navigate = useNavigate();
    const [gameStart, setGameStart] = useState(false);
    const [level, setLevel] = useState(null)
    const [questions, setQuestions] = useState([])
    const [players, setPlayers] = React.useState<PlayersData>({});
    const [numberOfQuestions, setNumberOfQuestions] = useState(0);

    const closeRoom = async (code: string) => {
        return await postRequest("/multi-play/closeRoom", {
            name: globalContext.username,
            code: code
        });
    };

    useEffect(() => {
        window.onpopstate = async () => {
            if (window.location.search === "" && admin) {
                await closeRoom(code);
                setCode("");
            }
        };
    }, [code, admin]);

    const onEnterWaitingRoom = (code) => {
        setCode(code);
        navigate(`/multi-player?code=${code}`);
    };

    return <div>
        {!code && !gameStart && <InviteOrJoin onSubmit={onEnterWaitingRoom} setAdmin={setAdmin}/>}

        {code && !gameStart &&
            <WaitingRoom
                setGameStart={setGameStart}
                code={code}
                admin={admin}
                level={level}
                setLevel={setLevel}
                players={players}
                setPlayers={setPlayers}
                questions={questions}
                setQuestions={setQuestions}
                setNumberOfQuestions={setNumberOfQuestions}
        />}

        {gameStart &&
            <MultiPlayerGame
                code={code}
                level={level}
                questions={questions}
                players={players}
                numberOfQuestions={numberOfQuestions}
        />}

    </div>;
}

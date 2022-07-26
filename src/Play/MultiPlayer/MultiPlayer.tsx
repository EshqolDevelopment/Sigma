import React, {useCallback, useContext, useEffect, useState} from "react";
import WaitingRoom from "./WaitingRoom";
import {InviteOrJoin} from "./InviteOrJoin";
import {useNavigate} from "react-router-dom";
import {GlobalContext, postRequest} from "../../Global";
import MultiPlayerGame from "./MultiPlayerGame";
import {PlayersData} from "../../DataTypes";
import {Helmet} from "react-helmet";
import Footer from "../../CommonComponents/Footer/Footer";


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

    const closeRoom = useCallback(async (code: string) => {
        return await postRequest("/multi-play/closeRoom", {
            name: globalContext.username,
            code: code
        });
    }, [globalContext.username]);

    useEffect(() => {
        window.onpopstate = async () => {
            if (window.location.search === "" && admin) {
                await closeRoom(code);
                setCode("");
            }
        };
    }, [code, admin, closeRoom]);

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#f6f9fc");
    }, [])

    const onEnterWaitingRoom = (code) => {
        setCode(code);
        navigate(`/multi-player?code=${code}`);
    };

    return <div>

        <Helmet>
            <title>Multi Player | Sigma Code Wars</title>
            <meta name={"description"} content={"Play Sigma Code Wars with your friends"}/>
        </Helmet>

        <main>
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
        </main>

        {!gameStart && <Footer/>}

    </div>;
}

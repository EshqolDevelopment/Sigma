import styles from "../Play/play.module.scss";
import React, {useEffect, useRef, useState} from "react";
import {GlobalContext, Level, postRequest} from "../Global";

type Props = {
    level: Level;
    setLevel: (level: Level | "") => void;
}

export default function SearchForMatch(props: Props) {
    const loadingDialog = useRef<HTMLDialogElement>();

    const globalContext = React.useContext(GlobalContext);
    const userEmail = globalContext.user.email;
    const [name, email] = userEmail.split('@')
    const userName = email !== 'eshqol.com' ? name + '_' : name
    const removed = React.useRef(false);

    const [matchData, setMatchData] = React.useState({} as {
        opponent: string,
        questions: string[],
    });

    useEffect(() => {
        loadingDialog.current.showModal();
        searchForMatch().then((data) => {
            console.log(removed.current);
            if (!removed.current) {
                console.log(data);
                loadingDialog.current.close();
            } else {
                console.log('removed');
            }
        })
    }, [])



    const searchForMatch = async (): Promise<{
        opponentName: string,
        questions: string[],
    }> => {
        return await postRequest(process.env["REACT_APP_JS_SERVER_URL"] + '/general/searchForOpponent', {
            name: userName,
            level: props.level
        })
    }

    const cancelSearch = async () => {
        const response = await postRequest(process.env["REACT_APP_JS_SERVER_URL"] + '/general/removeFromWaitingPool', {
            name: userName,
            level: props.level
        })
        if (response.result === "OK") {
            props.setLevel("");
            removed.current = true;
        }
    }

    return (
        <div>
            <dialog className={styles.loading} ref={loadingDialog}>
                <span>Searching for opponent...</span>

                <img src={"https://cdn.dribbble.com/users/544814/screenshots/3838751/dribbble_hourglass.gif"}/>

                <button onClick={cancelSearch}>Cancel</button>
            </dialog>
        </div>
    )
}

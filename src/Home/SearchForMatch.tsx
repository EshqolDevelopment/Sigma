import styles from "../Play/play.module.scss";
import React, {useEffect, useRef} from "react";
import {GlobalContext, Level, postRequest} from "../Global";
import {SinglePlayerGameData} from "../DataTypes";

type Props = {
    level: Level;
    setLevel: (level: Level | "") => void;
    onMatchFind: (data: SinglePlayerGameData) => void;
}

export default function SearchForMatch(props: Props) {
    const loadingDialog = useRef<HTMLDialogElement>();

    const globalContext = React.useContext(GlobalContext);
    const userEmail = globalContext.user.email;
    const [name, email] = userEmail.split('@')
    const userName = email !== 'eshqol.com' ? name + '_' : name

    useEffect(() => {
        loadingDialog.current.showModal();
        searchForMatch().then((data: SinglePlayerGameData) => {
            console.log(data)
            if (!data.error && data.questions) {
                props.onMatchFind(data);
            } else {
                props.setLevel("");
            }

        })
    }, [])

    const searchForMatch = async () => {
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

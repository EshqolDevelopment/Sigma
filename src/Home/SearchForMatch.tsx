import styles from "../Play/Setup/play.module.scss";
import React, {useEffect, useRef} from "react";
import {GlobalContext, Level, postRequest} from "../Global";
import {QuickPlayGameData} from "../DataTypes";

type Props = {
    level: Level;
    setLevel: (level: Level | "") => void;
    onMatchFind: (data: QuickPlayGameData) => void;
}

export default function SearchForMatch(props: Props) {
    const loadingDialog = useRef<HTMLDialogElement>();
    const globalContext = React.useContext(GlobalContext);

    useEffect(() => {
        loadingDialog.current.showModal();
        searchForMatch().then((data: QuickPlayGameData) => {
            console.log(data)
            if (!data.error && data.questions) {
                props.onMatchFind(data);
            } else {
                props.setLevel("");
            }
        })
    }, [])

    const searchForMatch = async () => {
        return await postRequest('/quick-play/searchForOpponent', {
            name: globalContext.username,
            level: props.level
        })
    }

    const cancelSearch = async () => {
        const response = await postRequest('/quick-play/removeFromWaitingPool', {
            name: globalContext.username,
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

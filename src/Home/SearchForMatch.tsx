import styles from "../Play/Setup/play.module.scss";
import matchScreenStyle from "../Play/QuickPlay/matchScreen.module.scss";
import {useContext, useEffect, useRef, useState} from "react";
import {GlobalContext, postRequest} from "../Global";
import {Level, QuickPlayGameData, UserData} from "../DataTypes";
import MatchScreen from "../Play/QuickPlay/MatchScreen";

type Props = {
    level: Level;
    setLevel: (level: Level | "") => void;
    setGameData: (data: QuickPlayGameData) => void;
}

export default function SearchForMatch(props: Props) {
    const loadingDialog = useRef<HTMLDialogElement>();
    const globalContext = useContext(GlobalContext);
    const [showMatchScreen, setShowMatchScreen] = useState(false);
    const [opponentData, setOpponentData] = useState<UserData>();

    useEffect(() => {
        const searchForMatchAction = async () => {
            return await postRequest("/quick-play/searchForOpponent", {
                name: globalContext.username,
                level: props.level
            });
        };

        if (!loadingDialog.current.open) {
            try {
                loadingDialog.current.showModal();
            } catch (e) {
                console.log(e);
            }
        }
        searchForMatchAction().then((data: QuickPlayGameData) => {
            if (!data.error && data.questions) {
                setOpponentData(data.opponent);
                setShowMatchScreen(true);
                setTimeout(() => {
                    setShowMatchScreen(false);
                    props.setGameData(data);
                }, 5000);
            } else {
                props.setLevel("");
            }
        });
    }, []);

    const cancelSearch = async () => {
        const response = await postRequest("/quick-play/removeFromWaitingPool", {
            name: globalContext.username,
            level: props.level
        }) as { result: string };
        if (response.result === "OK") {
            props.setLevel("");
        }
    };

    return (
        <div>
            <dialog className={[showMatchScreen ? matchScreenStyle.container : styles.loading].join(" ")}
                    ref={loadingDialog}>
                {!showMatchScreen && <>
                    <span>Searching for opponent...</span>
                    <img src={"https://cdn.dribbble.com/users/544814/screenshots/3838751/dribbble_hourglass.gif"}
                         alt={"hourglass"}/>
                    <button onClick={cancelSearch}>Cancel</button>
                </>}

                {showMatchScreen && <MatchScreen opponent={opponentData}/>}
            </dialog>

        </div>
    );
}

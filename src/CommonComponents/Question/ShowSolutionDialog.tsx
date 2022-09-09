import {Language, Level} from "../../DataTypes";
import React, {useContext, useEffect, useRef, useState} from "react";
import styles from "./solutionDialog.module.scss";
import {GlobalContext, postRequest, setLocalStorageItemWithExpiry} from "../../Global";

type Props = {
    level: Level;
    show: boolean;
    setShow: (show: boolean) => void;
    onSolution: (solution: string) => void;
    funcName: string;
    language: Language;
}

export default function ShowSolutionDialog(props: Props) {
    const dialog = useRef<HTMLDialogElement>();
    const globalContext = useContext(GlobalContext);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (props.show && !dialog.current.open) {
            dialog.current.showModal();
        } else if (!props.show && dialog.current.open) {
            dialog.current.close();
            props.setShow(false);
        }
    }, [props, props.show]);

    const LevelToPrice = {
        easy: 30,
        medium: 50,
        hard: 100
    }

    const cancel = () => {
        props.setShow(false);
    }

    const buySolution = async () => {
        setLoading(true);
        const solution = await postRequest("/general/getSolution", {
            funcName: props.funcName,
            name: globalContext.userData.name,
            language: props.language
        }) as {result: string};
        setLoading(false);

        if (solution.result) {
            setLocalStorageItemWithExpiry(`solution@${props.language}@${props.funcName}`, solution.result, 1000 * 3600);
            props.onSolution(solution.result);
            props.setShow(false);
        } else {
            globalContext.showToast("An error occurred", "error");
        }
    }

    return (
        <dialog className={["modal", styles.modal].join(" ")} ref={dialog} style={{width: "600px"}}>
             <div className={["container-modal", styles.dialog].join(" ")}>
                    <span className={styles.title}>Do you want to unlock the solution to this question?</span>
                    <span className={styles.description}>(The solution will be available for the next hour.)</span>
                    <span className={styles.priceDescription}>The price is {LevelToPrice[props.level]} coins</span>
                    <img className={styles.solutionIcon} src={"/images/solution.png"}/>

                    <button onClick={buySolution}>Yes</button>
                    <button onClick={cancel}>No</button>
             </div>
        </dialog>
    )

}

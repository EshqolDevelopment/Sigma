import s from "./singlePlayer.module.scss";
import {useEffect, useRef} from "react";

type Props = {
    record: number;
    close: () => void;
}

export default function NewRecord(props: Props) {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
        if (dialogRef.current && !dialogRef.current.open) {
            dialogRef.current.showModal();
        }
    }, []);

    return (
        <dialog ref={dialogRef} className={s.newRecord}>
            <button onClick={props.close} className={s.closeBtn}>
                <img className={s.closeRecord} src={"/images/x.png"}/>
            </button>
            <h2>You got a new record!</h2>
            <h3>Time: {props.record} seconds per question!</h3>
            <img className={s.recordLogo} src={"/images/new_record.png"}/>
        </dialog>
    )
}

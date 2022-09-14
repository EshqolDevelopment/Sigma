import {useContext, useEffect, useRef} from "react";
import styles from "./shareExam.module.scss";
import {GlobalContext} from "../../Global";
import {useNavigate} from "react-router-dom";

type Props = {
    show: boolean;
    setShow: (show: boolean) => void;
    examId: string;
}

export default function ShareExamDialog(props: Props) {
    const dialog = useRef<HTMLDialogElement>();
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const url = "https://sigmawars.com/exam/" + props.examId;


    useEffect(() => {
        if (props.show && !dialog.current.open) {
            dialog.current.showModal();
        }
    }, [props.show]);


    const copyLink = () => {
        props.setShow(false);
        navigator.clipboard.writeText(url);
        globalContext.showToast("Link copied to clipboard", "success");
        navigate("/my-exams");
    }

    const closeDialog = () => {
        props.setShow(false);
        navigate("/my-exams");
    }

    return (
        <dialog ref={dialog} className={styles.dialog}>
            <div className={styles.container}>
                <button onClick={closeDialog} className={styles.close + " removeDefault"}>
                    <img src={"/images/x.png"}/>
                </button>
                <h3>Share Exam</h3>

                <span>Share this link with your students:</span>
                <input readOnly={true} type={"text"} value={url}/>
                <button onClick={copyLink} className={styles.copyLinkBtn}>Copy Exam Link</button>
            </div>
        </dialog>
    )
}

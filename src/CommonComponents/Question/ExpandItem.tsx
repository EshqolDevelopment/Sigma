import React, {useState} from "react";
import styles from "./expandItem.module.css";

type Props = {
    title: string;
    content: JSX.Element;
}

export function ExpandItem(props: Props) {
    const [expanded, setExpanded] = useState(false);

    function openDescription() {
        setExpanded(!expanded);
    }

    return <div className={styles.expandItem}>
        <div className={styles.expandItemTitle}>
            <span>Optimal Space & Time Complexity</span>
            <img src={"/images/arrow.svg"} onClick={openDescription} alt={"open and close description"}
                 className={["arrow", expanded ? "arrowOpen" : ""].join(" ")}/>
        </div>

        {expanded &&
            <div className={styles.contentContainer}>
                {props.content}
            </div>
        }
    </div>
}

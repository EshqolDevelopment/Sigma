import React, {useState} from "react";
import styles from "./expandItem.module.css";

type Props = {
    title: string;
    content: JSX.Element;
}

export function ExpandItem(props: Props) {
    const [expanded, setExpanded] = useState<boolean | "loading">(false);
    const contentContainerRef = React.useRef<HTMLDivElement>();

    function openDescription() {
        if (!expanded) {
            setExpanded(true);
        } else {
            setExpanded("loading");
            contentContainerRef.current.animate([
                {height: contentContainerRef.current.scrollHeight + "px"},
                {height: "0px"}
            ], {
                duration: 200,
            }).onfinish = () => {
                setExpanded(false);
            }
            contentContainerRef.current.style.height = "0px";
            contentContainerRef.current.innerText = "";
        }
    }

    return <div className={styles.expandItem}>
        <div className={styles.expandItemTitle} onClick={openDescription}>
            <span>Optimal Space & Time Complexity</span>
            <img src={"/images/arrow.svg"} alt={"open and close description"}
                 className={[styles.arrow, (expanded && expanded !== "loading") ? styles.arrowOpen : ""].join(" ")}/>
        </div>

        {expanded &&
            <div className={styles.contentContainer} ref={contentContainerRef}>
                {props.content}
            </div>
        }
    </div>;
}

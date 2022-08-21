import React, {useState} from "react";

export function ExpandItem(props) {
    const [expanded, setExpanded] = useState(false);

    function openDescription() {
        setExpanded(!expanded);
    }

    return <div className={"expandItem"}>
        <div className={"expandItemTitle"}>
            <span>Optimal Space & Time Complexity</span>
            <img src={"/images/arrow.svg"} onClick={openDescription}
                 className={["arrow", expanded ? "arrowOpen" : ""].join(" ")}/>
        </div>

        {expanded &&
            <div className={"timeComplexityContainer"}>
                <span>Not available</span>
            </div>
        }
    </div>;
}

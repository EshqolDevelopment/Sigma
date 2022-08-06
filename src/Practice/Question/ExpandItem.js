import React, {useState} from "react";
import arrowIcon from "../../Photos/arrow.svg";

export function ExpandItem(props) {
    const [expanded, setExpanded] = useState(false);

    function openDescription() {
        setExpanded(!expanded);
    }

    return <div className={"expandItem"}>
        <div className={"expandItemTitle"}>
            <span>Optimal Space & Time Complexity</span>
            <img src={arrowIcon} onClick={openDescription}
                 className={["arrow", expanded ? "arrowOpen" : ""].join(" ")}/>
        </div>

        {expanded &&
            <div className={"timeComplexityContainer"}>
                <span>O(wh) time | O(wh) space - where w and h are the width and height of the input matrix</span>
            </div>
        }
    </div>;
}

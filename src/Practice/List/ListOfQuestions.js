import React, {useState} from "react";
import "./ListOfQuestions.css";
import like1Img from "../../Photos/star1.svg";
import like2Img from "../../Photos/star2.svg";


let lastStyleUpdate = Date.now();
let itemOnMouseIndex = null;
let currentDragItemIndexGlobal = null;

export default function ListOfQuestions(props) {
    const level = props.level;
    const [currentDragItemIndex, setCurrentDragItemIndex] = useState(null);
    const ItemHeight = 56;
    const questionList = props.questionList;

    function onMouseDown(i) {
        const top = document.getElementById(i + level).style.top;
        currentDragItemIndexGlobal = Math.floor(top.slice(0, top.length - 2) / ItemHeight);
        setCurrentDragItemIndex(i);
    }

    function onMouseUp() {
        currentDragItemIndexGlobal = null;
        setCurrentDragItemIndex(null);

        if (itemOnMouseIndex === null) return;
        const currentDragItem = document.getElementById(currentDragItemIndex + level);
        currentDragItem.style.top = itemOnMouseIndex * ItemHeight + "px";
        itemOnMouseIndex = null;
        arranAndSaveList();
    }

    function arranAndSaveList() {
        const topsList = new Set();
        const duplicates = new Map();
        for (let i = 0; i < questionList.length; i++) {
            const item = document.getElementById(i + level);
            let top = item.style.top;
            top = parseInt(top.slice(0, top.length - 2));
            if (top % ItemHeight !== 0) {
                top = top - top % ItemHeight;
            }
            top = top.toString();
            if (topsList.has(top)) duplicates[i] = top;
            else topsList.add(top);
        }

        for (let i in duplicates) {
            for (let j = 0; j < questionList.length; j++) {
                const top1 = (j * ItemHeight).toString();
                if (!topsList.has(top1)) {
                    document.getElementById(i + level).style.top = top1 + "px";
                    topsList.add(top1);
                    break;
                }
            }
        }

        const saveListIndexes = [];
        for (let i = 0; i < questionList.length; i++) {
            const top = i * ItemHeight + "px";
            for (let j = 0; j < questionList.length; j++) {
                if (document.getElementById(j + level).style.top === top) {
                    saveListIndexes.push(questionList[j]);
                    break;
                }
            }
        }

        localStorage.setItem("ListIndexes" + level, JSON.stringify(saveListIndexes));
        // console.log(saveListIndexes)
    }

    function onMouseMove(y) {
        if (currentDragItemIndex === null || props.questionIsFiltered) return;

        const currentDate = Date.now();
        if (currentDate - lastStyleUpdate < 5) return;

        const currentDragItem = document.getElementById(currentDragItemIndex + level);

        let startHeight = getComputedStyle(document.documentElement).getPropertyValue("--start-height");
        startHeight = parseInt(startHeight.slice(0, startHeight.length - 2));

        let aboveHeight = 0;
        if (window.innerWidth < 960) {
            let mobileGap = getComputedStyle(document.documentElement).getPropertyValue("--mobile-gap");
            mobileGap = parseInt(mobileGap.slice(0, mobileGap.length - 2));

            if (level === "medium") {
                aboveHeight = props.aboveListLength * ItemHeight + mobileGap;
            } else if (level === "hard") {
                aboveHeight = props.aboveListLength * ItemHeight + mobileGap * 2;
            }
        }

        const offsetY = y - startHeight - 10 - aboveHeight;
        if (offsetY < -20 || offsetY > ItemHeight * questionList.length - ItemHeight / 1.5) return;

        currentDragItem.style.top = offsetY + "px";
        itemOnMouseIndex = Math.floor((offsetY + ItemHeight / 2) / ItemHeight);
        let change = false;

        const findItemInTargetTop = (targetTop) => {
            let onMouseItem = document.getElementById(itemOnMouseIndex + level);
            let i = 0;
            while (targetTop + "px" !== onMouseItem.style.top) {
                if (i + 1 > questionList.length) return;
                onMouseItem = document.getElementById(i + level);
                i++;
            }
            return onMouseItem;
        };

        if (currentDragItemIndexGlobal - itemOnMouseIndex < 0) {
            for (let i = 1; i <= itemOnMouseIndex - currentDragItemIndexGlobal; i++) {
                const targetTop = currentDragItemIndexGlobal * ItemHeight + ItemHeight * i;
                const onMouseItem = findItemInTargetTop(targetTop);
                if (onMouseItem)
                    onMouseItem.style.top = (targetTop - ItemHeight) + "px";
            }
            change = true;

        } else if (currentDragItemIndexGlobal - itemOnMouseIndex > 0) {
            for (let i = 1; i <= currentDragItemIndexGlobal - itemOnMouseIndex; i++) {
                const targetTop = currentDragItemIndexGlobal * ItemHeight - ItemHeight * i;
                const onMouseItem = findItemInTargetTop(targetTop);

                if (onMouseItem)
                    onMouseItem.style.top = (targetTop + ItemHeight) + "px";
            }
            change = true;
        }
        if (change) {
            currentDragItemIndexGlobal = itemOnMouseIndex;
        }

        lastStyleUpdate = currentDate;
    }

    function onTouchStart(i) {
        onMouseDown(i);
    }

    function onTouchEnd() {
        onMouseUp();
    }

    function like(id) {
        const like = document.getElementById(id);
        if (like.src.includes("star2")) {
            like.src = like1Img;
        } else {
            like.src = like2Img;
        }

    }

    return (
        <div onMouseUp={onMouseUp} onMouseMove={(e) => onMouseMove(e.pageY)} onTouchEnd={onTouchEnd}
             onTouchMove={(e) => onMouseMove(e.touches[0].pageY)}>
            {
                questionList.map((data, i) => {

                    let [name, subject, level1, num] = data;
                    const isMultiArgument = subject.startsWith("$");
                    subject = isMultiArgument ? subject.substring(1) : subject;

                    return (
                        [<div key={i + level}
                             className={["question-item", currentDragItemIndex === i ? "on-drag" : "not-on-drag"].join(" ")}
                             style={{top: i * ItemHeight}} id={i + level}>

                            <div>
                                <div className={"circle"}/>
                                <span onClick={() => window.location.href = `/practice/${name}`}
                                      className={"nameText"}>{name}</span>
                            </div>


                            <div className={"rightContainer"}>
                                <div>
                                    <img className={"likeImg"} src={like1Img} id={"like" + level + i}
                                         onClick={() => like("like" + level + i)} alt={"Like"}/>
                                </div>

                                <div className={`grab-color color-${level.toLowerCase()}`}
                                     onMouseDown={() => onMouseDown(i)}
                                     onTouchStart={() => onTouchStart(i)}/>
                            </div>

                        </div>,

                        questionList.length - 1 === i &&
                        <div key={i + level} className={["question-item", "spacer"].join(" ")} style={{top: (i + 1) * ItemHeight}} id={i + level}/>
                        ]
                    );
                })
            }
        </div>
    );
}

import React, {useEffect, useRef} from "react";
import {QuickPlayModal} from "./QuickPlayDialog";
import {MultiPlayerModal} from "./MultiPlayerDialog";

export function PlayDialog(props) {
    const playDialog = useRef();

    useEffect(() => {
        if (props.show && !playDialog.current.open) {
            playDialog.current.showModal();
        } else if (!props.show && playDialog.current.open) {
            props.setShow(false);
            playDialog.current.close();
        }
    }, [props.show]);

    const quickPlay = () => {
        props.setShow("quick");
    }

    const playWithFriends = () => {
        props.setShow("friends");
    }

    return (
        <div>
            <dialog className={"modal"} ref={playDialog}>
                {props.show === true && <div className={"container-modal"}>
                    <div className={"modal-header"}>
                        <img src={"/images/close.png"} onClick={() => props.setShow(false)}/>
                        <h3>Choose play mode</h3>
                    </div>

                    <div className={"modal-container-body"}>
                        <button onClick={quickPlay}>
                            <img src={"/images/QuickPlay.svg"}/>
                            <span>Quick Play</span>
                        </button>

                        <button onClick={playWithFriends}>
                            <img src={"/images/MultiPlay.svg"}/>
                            <span>Play with friends</span>
                        </button>
                    </div>
                </div>}

                {props.show === "quick" && <QuickPlayModal show={props.show} setShow={props.setShow}/>}
                {props.show === "friends" && <MultiPlayerModal show={props.show} setShow={props.setShow}/>}


            </dialog>




        </div>

    )
}

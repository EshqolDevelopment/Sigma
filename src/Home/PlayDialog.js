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
                        <img src={"https://static.thenounproject.com/png/57781-200.png"} onClick={() => props.setShow(false)}/>
                        <h3>Choose play mode</h3>
                    </div>

                    <div className={"modal-container-body"}>
                        <button onClick={quickPlay}>
                            <svg width="512px" height="512px" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M258.9,48C141.92,46.42,46.42,141.92,48,258.9,49.56,371.09,140.91,462.44,253.1,464c117,1.6,212.48-93.9,210.88-210.88C462.44,140.91,371.09,49.56,258.9,48ZM385.32,375.25a4,4,0,0,1-6.14-.32,124.27,124.27,0,0,0-32.35-29.59C321.37,329,289.11,320,256,320s-65.37,9-90.83,25.34a124.24,124.24,0,0,0-32.35,29.58,4,4,0,0,1-6.14.32A175.32,175.32,0,0,1,80,259C78.37,161.69,158.22,80.24,255.57,80S432,158.81,432,256A175.32,175.32,0,0,1,385.32,375.25Z"/>
                                <path d="M256,144c-19.72,0-37.55,7.39-50.22,20.82s-19,32-17.57,51.93C191.11,256,221.52,288,256,288s64.83-32,67.79-71.24c1.48-19.74-4.8-38.14-17.68-51.82C293.39,151.44,275.59,144,256,144Z"/>
                            </svg>
                            <span>Quick Play</span>
                        </button>

                        <button onClick={playWithFriends}>
                            <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                                <path d="M256 464c-114.69 0-208-93.31-208-208S141.31 48 256 48s208 93.31 208 208-93.31 208-208 208Zm0-384c-97 0-176 79-176 176s79 176 176 176 176-78.95 176-176S353.05 80 256 80Z"/>
                                <path d="M323.67 292c-17.4 0-34.21-7.72-47.34-21.73a83.76 83.76 0 0 1-22-51.32c-1.47-20.7 4.88-39.75 17.88-53.62S303.38 144 323.67 144c20.14 0 38.37 7.62 51.33 21.46s19.47 33 18 53.51a84 84 0 0 1-22 51.3C357.86 284.28 341.06 292 323.67 292Zm55.81-74Zm-215.66 77.36c-29.76 0-55.93-27.51-58.33-61.33-1.23-17.32 4.15-33.33 15.17-45.08s26.22-18 43.15-18 32.12 6.44 43.07 18.14 16.5 27.82 15.25 45c-2.44 33.77-28.6 61.27-58.31 61.27Zm256.55 59.92c-1.59-4.7-5.46-9.71-13.22-14.46-23.46-14.33-52.32-21.91-83.48-21.91-30.57 0-60.23 7.9-83.53 22.25-26.25 16.17-43.89 39.75-51 68.18-1.68 6.69-4.13 19.14-1.51 26.11a192.18 192.18 0 0 0 232.75-80.17Zm-256.74 46.09c7.07-28.21 22.12-51.73 45.47-70.75a8 8 0 0 0-2.59-13.77c-12-3.83-25.7-5.88-42.69-5.88-23.82 0-49.11 6.45-68.14 18.17-5.4 3.33-10.7 4.61-14.78 5.75a192.84 192.84 0 0 0 77.78 86.64l1.79-.14a102.82 102.82 0 0 1 3.16-20.02Z"/>
                            </svg>
                            <img src={"/logo192.png"}/>
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

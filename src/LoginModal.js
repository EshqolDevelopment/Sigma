import React, {useEffect, useRef, useState} from "react";
import loginStyle from "./login.module.scss"
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";

export default function LoginModal(props) {
    const multiPlayDialog = useRef();


    useEffect(() => {
        if (props.show && !multiPlayDialog.current.open) {
            multiPlayDialog.current.showModal();
        } else if (!props.show && multiPlayDialog.current.open) {
            multiPlayDialog.current.close();
        }
    }, [props.show]);


    const firebaseLogin = async (e) => {
        e.preventDefault()

        let result;
        // check which button was clicked
        const btnName = document.activeElement.getAttribute("name")

        if (btnName === "google") {
            result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
        } else if (btnName === "login") {
            result = await signInWithEmailAndPassword(getAuth(), e.target.email.value, e.target.password.value);
        } else {
            result = await createUserWithEmailAndPassword(getAuth(), e.target.email.value, e.target.password.value);
        }
        if (result.user) {
            multiPlayDialog.current.close();
        }
    }


    return (
        <dialog ref={multiPlayDialog} className={loginStyle.popup}>

            <div className={loginStyle.container}>
                <img src={"https://static.thenounproject.com/png/57781-200.png"}
                     onClick={() => props.setShow(false)}/>

                <h3 className={loginStyle.title}>Login</h3>
                <h4 className={loginStyle.subTitle}>Become a faster & <span>better coder</span></h4>

                <form className={loginStyle.form} onSubmit={firebaseLogin}>
                    <input name={"email"} placeholder={"Email"} type={"email"} required={true}/>
                    <input name={"password"} placeholder={"Password"} type={"password"} required={true}/>

                    <div className={loginStyle.actionContainer}>
                        <button name={"login"}>Login</button>
                        <button name={"register"}>Register</button>

                        <span className={loginStyle.or}>Or</span>
                        <button name={"google"} className={loginStyle.loginWithGoogle}>
                            <span>Continue with Google</span>
                            <img src={"https://freesvg.org/img/1534129544.png"}/>
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
}

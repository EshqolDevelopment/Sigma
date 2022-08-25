import React, {useEffect, useRef, useState} from "react";
import loginStyle from "./login.module.scss"
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {postRequest} from "./Global";

export default function LoginModal(props) {
    const multiPlayDialog = useRef<HTMLDialogElement>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        if (props.show && !multiPlayDialog.current.open) {
            multiPlayDialog.current.showModal();
        } else if (!props.show && multiPlayDialog.current.open) {
            multiPlayDialog.current.close();
        }
    }, [props.show]);


    const formatEmail = (email) => {
        if (!email.includes("@")) {
            email += "@sigma.com"
        }
        return email;
    }

    const googleLogin = async () => {
        const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());
        await postRequest("/general/onGoogleLogin", {email: result.user.email});

        if (result.user) {
            multiPlayDialog.current.close();
        }
    }

    const createAccount = async () => {
        let email = formatEmail(username)
        const res = await postRequest("/general/onUserCreated", {email}) as {result: string};
        if (res.result === "OK") {
            const result = await createUserWithEmailAndPassword(getAuth(), email, password);

            if (result.user) {
                multiPlayDialog.current.close();
            }
        }
    }

    const login = async () => {
        let email = formatEmail(username)
        const result = await signInWithEmailAndPassword(getAuth(), email, password);

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

                <div className={loginStyle.form}>
                    <input name={"email"} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={"Email or username"} type={"text"} required={true}/>
                    <input name={"password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Password"} type={"password"} required={true}/>

                    <div className={loginStyle.actionContainer}>
                        <button name={"login"} onClick={login}>Login</button>
                        <button name={"register"} onClick={createAccount}>Register</button>

                        <span className={loginStyle.or}>Or</span>
                        <button name={"google"} onClick={googleLogin} className={loginStyle.loginWithGoogle}>
                            <span>Continue with Google</span>
                            <img src={"https://freesvg.org/img/1534129544.png"}/>
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

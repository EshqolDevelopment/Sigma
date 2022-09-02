import React, {useContext, useEffect, useRef, useState} from "react";
import loginStyle from "./login.module.scss"
import {getAuth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword} from "firebase/auth";
import {GlobalContext} from "./Global";

export default function LoginModal(props) {
    const multiPlayDialog = useRef<HTMLDialogElement>();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const globalContext = useContext(GlobalContext);
    const [error, setError] = useState("");

    useEffect(() => {
        if (props.show && !multiPlayDialog.current.open) {
            multiPlayDialog.current.showModal();
        } else if (!props.show && multiPlayDialog.current.open) {
            multiPlayDialog.current.close();
        }
    }, [props.show]);


    const formatEmail = (email) => {
        return email + "@sigma.com"
    }

    const googleLogin = async () => {
        try {
            const result = await signInWithPopup(getAuth(), new GoogleAuthProvider());

            if (result.user) {
                if (result.user.metadata.creationTime !== result.user.metadata.lastSignInTime) {
                    globalContext.showToast("Signed in successfully", "success");
                }
                multiPlayDialog.current.close();
            } else {
                setError("An unexpected error occurred");
            }
        } catch (e) {
            setError("An unexpected error occurred");
        }
    }

    const isUsernameValid = (username) => {
        return username.length > 3 && username.length < 20 && username.match(/^\w+$/) && !username.includes("@") && !username.includes("_");
    }

    const createAccount = async () => {
        try {
            if (!isUsernameValid(username)) {
                setError("Username is invalid");
                return;
            } else if (password.length < 6) {
                setError("Password needs to be at least 6 characters long");
                return;
            }
            const email = formatEmail(username)
            const result = await createUserWithEmailAndPassword(getAuth(), email, password);

            if (result.user) {
                multiPlayDialog.current.close();
            } else {
                setError("An unexpected error occurred");
            }
        } catch (e) {
            if (e.code === "auth/email-already-in-use") {
                setError("An account with this email already exists");
            } else if (e.code === "auth/invalid-email") {
                setError("Invalid email");
            } else if (e.code === "auth/weak-password") {
                setError("Password is too weak");
            } else {
                setError(e.code);
            }
        }
    }

    const login = async () => {
        let email = formatEmail(username)
        try {
            const result = await signInWithEmailAndPassword(getAuth(), email, password);

            if (result.user) {
                globalContext.showToast("Signed in successfully", "success");
                multiPlayDialog.current.close();
            } else {
                setError("Unexpected error occurred");
            }
        } catch (e) {
            if (e.code === "auth/wrong-password" || e.code === "auth/user-not-found") {
                setError("Username or password are incorrect");
            } else {
                setError(e.code);
            }
        }
    }


    return (
        <dialog ref={multiPlayDialog} className={loginStyle.popup}>

            <div className={loginStyle.container}>
                <img src={"/images/x.png"} alt={"close dialog"}
                     onClick={() => props.setShow(false)}/>

                <h3 className={loginStyle.title}>Login</h3>
                <h4 className={loginStyle.subTitle}>Become a faster & <span>better coder</span></h4>

                <div className={loginStyle.form}>
                    <input name={"email"} value={username} onChange={(e) => setUsername(e.target.value)} placeholder={"User name"} type={"text"} required={true}/>
                    <input name={"password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={"Password"} type={"password"} required={true}/>

                    {error && <span className={loginStyle.error}>{error}</span>}

                    <div className={loginStyle.actionContainer}>
                        <button name={"login"} onClick={login}>Login</button>
                        <button name={"register"} onClick={createAccount}>Register</button>

                        <span className={loginStyle.or}>Or</span>
                        <button name={"google"} onClick={googleLogin} className={loginStyle.loginWithGoogle}>
                            <span>Continue with Google</span>
                            <img src={"/images/google.png"} alt={"google logo"}/>
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}

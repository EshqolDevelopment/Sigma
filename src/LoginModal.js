import React, {useEffect, useRef, useState} from "react";
import loginStyle from "./login.module.scss"

export default function LoginModal(props) {
    const multiPlayDialog = useRef();


    useEffect(() => {
        if (props.show && !multiPlayDialog.current.open) {
            multiPlayDialog.current.showModal();
        } else if (!props.show && multiPlayDialog.current.open) {
            multiPlayDialog.current.close();
        }
    }, [props.show]);



    return (
        <dialog ref={multiPlayDialog} className={loginStyle.popup}>

            <div className={loginStyle.container}>
                <img src={"https://static.thenounproject.com/png/57781-200.png"}
                     onClick={() => props.setShow(false)}/>

                <h3 className={loginStyle.title}>Login</h3>
                <h4 className={loginStyle.subTitle}>Become a faster & <span>better coder</span></h4>

                <form className={loginStyle.form}>
                    <input placeholder={"Email"} type={"email"} required={true}/>
                    <input placeholder={"Password"} type={"password"} required={true}/>

                    <div className={loginStyle.actionContainer}>
                        <button>Login</button>
                        <button>Register</button>

                        <span className={loginStyle.or}>Or</span>
                        <button className={loginStyle.loginWithGoogle}>
                            <span>Continue with Google</span>
                            <img src={"https://freesvg.org/img/1534129544.png"}/>
                        </button>
                    </div>


                </form>


            </div>
        </dialog>
    );
}

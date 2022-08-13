import React, {useState} from "react";
import style from "./Navigation.module.css";
import {getAuth} from "firebase/auth";
import LoginModal from "../LoginModal";


const moveWindow = (page) => window.location.href = `/${page.toLowerCase()}`;

const isActive = (currentPage, page) => {
    if (currentPage === page) return true;
    if (currentPage === "") return page === "home";
    return false;
};

export default function NavigationBar(props) {
    const [showLogin, setShowLogin] = useState(false)
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const currentPage = window.location.pathname.split("/")[1].toLocaleLowerCase();

    const user = getAuth().currentUser

    const openLoginModal = () => {
        setShowLogin(true)
    }

    return (
        <nav className={style.navigationBar}>
            <div className={style.navMenu}>
                {pages.map((page, index) => {
                    return (
                        <a key={index} className={[style.page, isActive(currentPage.toLocaleLowerCase(), page.toLocaleLowerCase()) ? style.active : ""].join(" ")} onClick={() => moveWindow(page)} href={"/" + page.toLowerCase()}>
                            {page}
                        </a>
                    );
                })}
            </div>

            {user && <img src={require("../Photos/p1.png")} className={style.profileImage} alt={"profile"}/>}
            {!user && <button className={style.loginBtn} onClick={openLoginModal}>Login</button>}

            {showLogin && <LoginModal show={showLogin} setShow={setShowLogin}/>}

        </nav>
    );
}

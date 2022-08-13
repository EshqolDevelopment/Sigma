import React, {createRef, useState} from "react";
import style from "./Navigation.module.css";
import {getAuth} from "firebase/auth";
import LoginModal from "../LoginModal";

const moveWindow = (page) => window.location.href = `/${page.toLowerCase()}`;



export default function NavigationBar(props) {
    const [showLogin, setShowLogin] = useState(false);
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const currentPage = window.location.pathname.split("/")[1].toLocaleLowerCase();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = createRef();

    const user = getAuth().currentUser;

    const openLoginModal = () => {
        setShowLogin(true);
    };

    const openMobileMenu = () => {
        if (!mobileMenuOpen) {
            mobileMenuRef.current.classList.add(style.mobileMenuOpen);
        } else {
            mobileMenuRef.current.classList.remove(style.mobileMenuOpen);
        }
        setMobileMenuOpen(!mobileMenuOpen);
    }

    const isActive = (currentPage, page) => {
        if (currentPage === page) return true;
        if (currentPage === "") return page === "home";
        return false;
    };


    return (
        <nav className={style.navigationBar}>
            <div className={style.navMenu}>
                {pages.map((page, index) => {
                    return (
                        <a key={index}
                           className={[style.page, isActive(currentPage.toLocaleLowerCase(), page.toLocaleLowerCase()) ? style.active : ""].join(" ")}
                           onClick={() => moveWindow(page)} href={"/" + page.toLowerCase()}>
                            {page}
                        </a>
                    );
                })}
            </div>

            <div className={style.mobileMenu} onClick={openMobileMenu} ref={mobileMenuRef}>
                <div/>
                <div/>
                <div/>
            </div>


            <div className={style.leftSide}>
                {user && <img src={require("../Photos/p1.png")} className={style.profileImage} alt={"profile"}/>}
                {!user && <button className={style.loginBtn} onClick={openLoginModal}>Login</button>}
                {showLogin && <LoginModal show={showLogin} setShow={setShowLogin}/>}
            </div>


            {mobileMenuOpen && <div className={style.mobileMenuContent}>

                <div>
                    <span>Home</span>
                </div>
                <div>
                    <span>Practice</span>
                </div>
                <div>
                    <span>Leaderboard</span>
                </div>
                <div>
                    <span>Compiler</span>
                </div>

            </div>}

        </nav>
    );
}

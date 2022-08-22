import React, {createRef, useContext, useState} from "react";
import style from "./Navigation.module.css";
import LoginModal from "../LoginModal";
import {GlobalContext} from "../Global";
import {Link} from "react-router-dom";



export default function NavigationBar() {
    const [showLogin, setShowLogin] = useState(false);
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = createRef<HTMLDivElement>();
    const globalContext = useContext(GlobalContext);
    const [activePage, setActivePage] = useState(window.location.pathname.split("/")[1].toLocaleLowerCase());

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

    const onPageChange = (page) => {
        setActivePage(page);
    }


    return (
        <nav className={style.navigationBar}>
            <div className={style.navMenu}>
                {pages.map((page, index) => {
                    return (
                        <Link key={index} onClick={() => onPageChange(page)}
                           className={[style.page, isActive(activePage.toLocaleLowerCase(), page.toLocaleLowerCase()) ? style.active : ""].join(" ")}
                            to={"/" + (page.toLowerCase() === "home" ? "" :  page.toLowerCase())}>
                            {page}
                        </Link>
                    );
                })}
            </div>

            <div className={style.mobileMenu} onClick={openMobileMenu} ref={mobileMenuRef}>
                <div/>
                <div/>
                <div/>
            </div>

            <div className={style.leftSide}>
                {globalContext.userName === null && <>
                    <button className={style.loginBtn} onClick={openLoginModal}>Login</button>
                    <LoginModal show={showLogin} setShow={setShowLogin}/>
                    <img src={"/images/logo.png"} className={style.sigmaIcon} alt={"logo"}/>
                </>}
                {globalContext.userName && <img src={"/images/p1.png"} className={style.sigmaIcon} alt={"logo"}/>}
            </div>

            {mobileMenuOpen && <div className={style.mobileMenuContent}>
                <span>Hello, {globalContext.userName}</span>
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

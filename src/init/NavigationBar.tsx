import React, {createRef, useContext, useRef, useState} from "react";
import style from "./Navigation.module.css";
import LoginModal from "../LoginModal";
import {GlobalContext} from "../Global";
import {Link} from "react-router-dom";
import {Profile} from "../CommonComponents/Profile/Profile";


export default function NavigationBar() {
    const [showLogin, setShowLogin] = useState(false);
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = createRef<HTMLDivElement>();
    const globalContext = useContext(GlobalContext);
    const [activePage, setActivePage] = useState(window.location.pathname.split("/")[1].toLocaleLowerCase());
    const [showProfile, setShowProfile] = useState(false);

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

    const openProfile = () => {
        setShowProfile(true);
    }


    return (
        <nav className={style.navigationBar}>
            <div className={style.navMenu}>
                {pages.map((page, index) => {
                    return (
                        <Link key={index} onClick={() => onPageChange(page)}
                              className={[style.page, isActive(activePage.toLocaleLowerCase(), page.toLocaleLowerCase()) ? style.active : ""].join(" ")}
                              to={"/" + (page.toLowerCase() === "home" ? "" : page.toLowerCase())}>
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
                {globalContext.username === null && <>
                    <button className={style.loginBtn} onClick={openLoginModal}>Login</button>
                    <LoginModal show={showLogin} setShow={setShowLogin}/>
                    <img src={"/images/logo.png"} className={style.sigmaIcon} alt={"logo"}/>
                </>}

                {globalContext.userData && globalContext.username &&
                    <>
                        <span className={style.coinsText}>{globalContext.userData.coins}</span>
                        <img src={"/images/coins.png"} className={style.coins}/>
                        <img src={`/images/p${globalContext.userData.image}.png`} className={style.sigmaIcon}
                             alt={"logo"}
                             onClick={openProfile}
                        />
                    </>
                }

            </div>

            {mobileMenuOpen && <div className={style.mobileMenuContent}>
                <span>Hello, {globalContext.username}</span>
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


            {showProfile && <Profile close={() => setShowProfile(false)}/>}
        </nav>
    );
}

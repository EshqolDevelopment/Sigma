import React, {createRef, useContext, useEffect, useState} from "react";
import style from "./Navigation.module.scss";
import LoginModal from "../Authentication/LoginModal";
import {GlobalContext} from "../Global";
import {Link} from "react-router-dom";
import {Profile} from "../CommonComponents/Profile/Profile";
import BuyCoins from "../CommonComponents/BuyCoins/BuyCoins";
import { useLocation } from "react-router";


let lastCoinsUpdate = 0;
export default function NavigationBar() {
    const [showLogin, setShowLogin] = useState(false);
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = createRef<HTMLButtonElement>();
    const globalContext = useContext(GlobalContext);
    const [activePage, setActivePage] = useState(window.location.pathname.split("/")[1].toLowerCase());
    const [showProfile, setShowProfile] = useState(false);
    const [showCoinsShop, setShowCoinsShop] = useState(false);
    const [lastCoinsDelta, setLastCoinsDelta] = useState(0);
    const location = useLocation();

    useEffect(() => {
        setActivePage(location.pathname.split("/")[1].toLowerCase());
    }, [location]);


    useEffect(() => {
        if (globalContext.userData && globalContext.userData.coins - lastCoinsUpdate !== 0) {
            setLastCoinsDelta(globalContext.userData.coins - lastCoinsUpdate);

            lastCoinsUpdate = globalContext.userData.coins;
            setTimeout(() => {
                setLastCoinsDelta(0);
            }, 10_000);
        }
    }, [globalContext.userData, globalContext.userData?.coins]);

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

    const nameToUrl = (name) => {
        return name.toLowerCase().replace(" ", "-");
    }

    return (
        <nav className={style.navigationBar}>
            <div className={style.navMenu}>
                <div className={style.logo}>
                    <img src={"/images/nav-logo.png"} alt={"Sigma Code Wars"}/>
                    <span>SigmaCodeWars</span>
                </div>

                {pages.map((page, index) => {
                    return (
                        <Link key={index}
                              className={[style.page, isActive(nameToUrl(activePage), nameToUrl(page)) ? style.active : ""].join(" ")}
                              to={"/" + (nameToUrl(page) === "home" ? "" : nameToUrl(page))}>
                            {page}
                        </Link>
                    );
                })}
            </div>

            <button className={style.mobileMenu} onClick={openMobileMenu} ref={mobileMenuRef}>
                <div/>
                <div/>
                <div/>
            </button>

            <div className={style.rightSide}>
                {globalContext.username === null && <>
                    <button className={style.loginBtn} onClick={openLoginModal}>Login</button>
                    <LoginModal show={showLogin} setShow={setShowLogin}/>
                    <img src={"/images/logo.png"} className={style.sigmaIcon} alt={"logo"}/>
                </>}

                {globalContext.userData && globalContext.username &&
                    <>
                        {!!lastCoinsDelta && lastCoinsDelta !== globalContext.userData.coins && <span className={style.plusCoins}>{lastCoinsDelta >= 0 ? "+" : ""}{lastCoinsDelta}</span>}
                        <span className={style.coinsText}>{globalContext.userData.coins}</span>
                        <button className={"removeDefault"} onClick={() => setShowCoinsShop(true)}>
                            <img src={"/images/coins.png"} className={style.coins} alt={"coins"}/>
                        </button>
                        <button className={"removeDefault"} onClick={() => setShowProfile(true)} style={{height: "100%", marginTop: "3px"}}>
                            <img src={`/images/p${globalContext.userData.image}.png`} className={style.profileImage}
                                 alt={"logo"}
                            />
                        </button>

                    </>
                }

            </div>

            {mobileMenuOpen && <div className={style.mobileMenuContent}>
                <span>Hello, {globalContext.userData?.displayName}</span>
                {pages.map((page, index) => {
                    return (
                        <Link className={style.mobileLink} onClick={openMobileMenu} key={index} to={"/" + (nameToUrl(page)) === "home" ? "" : nameToUrl(page)}>
                            <img src={`/images/${nameToUrl(page)}.png`} alt={"coins"}/>
                            <span>{page}</span>
                        </Link>
                    );
                })}

            </div>}


            {showProfile && <Profile close={() => setShowProfile(false)} userData={globalContext.userData}/>}

            {showCoinsShop && <BuyCoins close={() => setShowCoinsShop(false)}/>}
        </nav>
    );
}

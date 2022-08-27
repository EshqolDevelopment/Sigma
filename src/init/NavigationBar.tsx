import React, {createRef, useContext, useEffect, useState} from "react";
import style from "./Navigation.module.css";
import LoginModal from "../LoginModal";
import {GlobalContext} from "../Global";
import {Link} from "react-router-dom";
import {Profile} from "../CommonComponents/Profile/Profile";
import BuyCoins from "../CommonComponents/BuyCoins/BuyCoins";


let lastCoinsUpdate = 0;
export default function NavigationBar() {
    const [showLogin, setShowLogin] = useState(false);
    const pages = ["Home", "Practice", "Leaderboard", "Compiler"];
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const mobileMenuRef = createRef<HTMLButtonElement>();
    const globalContext = useContext(GlobalContext);
    const [activePage, setActivePage] = useState(window.location.pathname.split("/")[1].toLocaleLowerCase());
    const [showProfile, setShowProfile] = useState(false);
    const [showCoinsShop, setShowCoinsShop] = useState(false);
    const [lastCoinsDelta, setLastCoinsDelta] = useState(0);

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

    const onPageChange = (page) => {
        setActivePage(page);
    }

    const openProfile = () => {
        setShowProfile(true);
    }

    const buyCoins = () => {
        setShowCoinsShop(true);
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

            <button className={style.mobileMenu} onClick={openMobileMenu} ref={mobileMenuRef}>
                <div/>
                <div/>
                <div/>
            </button>

            <div className={style.leftSide}>
                {globalContext.username === null && <>
                    <button className={style.loginBtn} onClick={openLoginModal}>Login</button>
                    <LoginModal show={showLogin} setShow={setShowLogin}/>
                    <img src={"/images/logo.png"} className={style.sigmaIcon} alt={"logo"}/>
                </>}

                {globalContext.userData && globalContext.username &&
                    <>
                        {!!lastCoinsDelta && lastCoinsDelta !== globalContext.userData.coins && <span className={style.plusCoins}>{lastCoinsDelta >= 0 ? "+" : ""}{lastCoinsDelta}</span>}
                        <span className={style.coinsText}>{globalContext.userData.coins}</span>
                        <button className={"removeDefault"} onClick={buyCoins}>
                            <img src={"/images/coins.png"} className={style.coins} alt={"coins"}/>
                        </button>
                        <button className={"removeDefault"} onClick={openProfile} style={{height: "100%", marginTop: "3px"}}>
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
                        <Link className={style.mobileLink} onClick={openMobileMenu} key={index} to={"/" + (page.toLowerCase() === "home" ? "" : page.toLowerCase())}>
                            <img src={`/images/${page.toLowerCase()}.png`} alt={"coins"}/>
                            <span>{page}</span>
                        </Link>
                    );
                })}

            </div>}


            {showProfile && <Profile close={() => setShowProfile(false)}/>}

            {showCoinsShop && <BuyCoins close={() => setShowCoinsShop(false)}/>}
        </nav>
    );
}

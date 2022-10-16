import React, {useContext, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import s from "./Profile.module.scss";
import {GlobalContext, winRate} from "../Global";
import Loading from "../CommonComponents/Loading/Loading";
import {getAuth} from "firebase/auth";
import History from "./History";
import Statistics from "./Statistics";


type tabType = "profile" | "history" | "statistics"


export default function Profile(props: { tab: tabType }) {
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const userData = globalContext.userData
    const tab = props.tab

    useEffect(() => {
        document.documentElement.style.setProperty('--background', 'dodgerblue');
    }, [navigate]);

    if (!userData) return <Loading/>

    const isCurrentUser = (userData.name) && (userData.name === globalContext?.userData.name);

    const signWithPassword = isCurrentUser && !userData.name.endsWith('_')

    const switchTab = (tab: tabType) => {
        if (tab !== "profile")
            navigate(`/profile/${tab}`);

        else
            navigate(`/profile`);
    }

    const signOut = () => {
        globalContext.showToast("Signed out successfully", "info");
        getAuth().signOut();
        setTimeout(() => {
            window.location.reload();
        }, 500)
    }

    const Profile = () => <div className={s.profile}>
        <div className={s.buttons}>
            {isCurrentUser && <button className={[s.signOut, s.greenBtn].join(" ")}>Export to CSV</button>}
            {signWithPassword && <button className={[s.signOut, s.greenBtn].join(" ")} onClick={signOut}>Change Password</button>}
            {isCurrentUser && <button className={s.signOut} onClick={signOut}>Sign Out</button>}
            {isCurrentUser && <button className={s.signOut}>Delete Account</button>}
        </div>

        <div className={s.stats}>
            <div className={s.profileHead}>
                <span>{userData.displayName}</span>

                <button>
                    <img src={`/images/p${userData.image}.png`} alt={"profile"}/>
                </button>
            </div>

            <div>
                <span>Victories</span>
                <span>{userData.wins}</span>
            </div>

            <div>
                <span>Defeats</span>
                <span>{userData.losses}</span>
            </div>

            <div>
                <span>Winning rate</span>
                <span>{winRate(userData)}%</span>
            </div>

            <div>
                <span>Coins</span>
                <span>{userData.coins}</span>
            </div>

            <div>
                <span>Points</span>
                <span>{userData.points}</span>
            </div>
        </div>
    </div>

    const tabs = ["profile", "history", "statistics"];

    return <main className={s.container}>
        <div className={s.tabs}>
            {tabs.map((tabName, i) =>
                <span key={i} className={tabName === tab ? s.activeTab : s.inactiveTab}
                      onClick={() => switchTab(tabName as tabType)}>
                {tabName}
            </span>)}
        </div>
        {tab === "profile" ? <Profile/> : tab === "history" ? <History/> : <Statistics/>}
    </main>
}

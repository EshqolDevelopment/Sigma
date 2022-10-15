import React, {useContext, useEffect, useRef, useState} from "react";
import {useNavigate} from "react-router-dom";
import s from "./Profile.module.scss";
import {GlobalContext, postRequest} from "../Global";
import style from "../CommonComponents/Profile/profile.module.scss";


type tabType = "profile" | "history" | "statistics"


export default function Profile() {
    const [tab, setTab] = React.useState<tabType>("profile");
    const [chooseProfile, setChooseProfile] = useState(false);
    const globalContext = useContext(GlobalContext);
    const navigate = useNavigate();
    const userData = globalContext?.userData

    const setNewProfileImage = async (image: number) => {
        await postRequest("/general/changeProfileImage", {
            image: image,
            name: userData.name
        })
        setChooseProfile(false);
    }

    const isCurrentUser = (userData?.name) && (userData?.name === globalContext?.userData?.name);

    const openChooseProfileDialog = () => {
        if (isCurrentUser) {
            setChooseProfile(true)
        }
    }


    useEffect(() => {

        document.body.style.background = "dodgerblue";

        const path = window.location.pathname;

        if (path === "/profile") {
            setTab("profile");
        }

        else if (path === "/profile/history") {
            setTab("history");
            navigate("/profile/history");
        }

        else if (path === "/profile/statistics") {
            setTab("statistics");
            navigate("/profile/statistics");
        }

        else {
            setTab("profile");
            navigate("/profile");
        }

    }, [navigate]);

    const switchTab = (tab: tabType) => {
        setTab(tab);

        if (tab !== "profile")
            navigate(`/profile/${tab}`);

        else
            navigate(`/profile`);
    }

    const GetProfile = () => <div className={s.profile}>
        <div>
            <span className={style.name}>{userData?.displayName}</span>

            <button className={style.removeDefault} onClick={openChooseProfileDialog}>
                <img src={`/images/p${userData?.image}.png`} className={style.profileImage} alt={"profile"}/>
            </button>
        </div>
    </div>

    return <div className={s.container}>
        <div className={s.tabs}>
            {
                ['profile', 'history', 'statistics'].map((tabName, i) =>
                    <span key={i} className={tabName === tab ? 'activeTab' : ''} onClick={() => switchTab(tabName as tabType)}>
                        {tabName}
                    </span>
                )
            }
        </div>

        {tab === "profile" ? <GetProfile/> : null}
    </div>
}

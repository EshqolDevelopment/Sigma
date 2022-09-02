import {useContext, useEffect, useRef, useState} from "react";
import style from "./profile.module.scss";
import {GlobalContext, postRequest, winRate} from "../../Global";
import {getAuth} from "firebase/auth";
import {UserData} from "../../DataTypes";

type Props = {
    close: () => void;
    userData: UserData;
}

export function Profile(props: Props) {
    const globalContext = useContext(GlobalContext);
    const profileRef = useRef<HTMLDialogElement>()
    const [chooseProfile, setChooseProfile] = useState(false);

    useEffect(() => {
        if (profileRef.current && !profileRef.current.open) {
            profileRef.current.showModal();
        }
    }, [])

    const signOut = () => {
        globalContext.showToast("Signed out successfully", "info");
        getAuth().signOut();
        props.close();
    }

    const setNewProfileImage = async (image: number) => {
        await postRequest("/general/changeProfileImage", {
            image: image,
            name: props.userData.name
        })
        setChooseProfile(false);
    }

    const openChooseProfileDialog = () => {
        if (props.userData.name === globalContext.userData.name) {
            setChooseProfile(true)
        }
    }

    const profileImages = []
    for (let i = 1; i <= 18; i++) {
        profileImages.push(<button key={i} className={style.removeDefault} onClick={() => setNewProfileImage(i)}>
            <img src={`/images/p${i}.png`} alt={`profile ${i}`}/>
        </button>)
    }

    return <dialog ref={profileRef} className={style.profileDialog}>
        {!chooseProfile && <div className={style.profileContainer}>

            <div className={style.profileTitleRow}>
                <button className={style.x + " " + style.removeDefault} onClick={props.close}>
                    <img src={"/images/x.png"} alt={"close"}/>
                </button>
                <button className={style.signOut} onClick={signOut}>Sign Out</button>
            </div>

            <span className={style.name}>{props.userData.displayName}</span>

            <button className={style.removeDefault} onClick={openChooseProfileDialog}>
                <img src={`/images/p${props.userData.image}.png`} className={style.profileImage} alt={"profile"}/>
            </button>

            <div className={style.infoRow}>
                <span>Victories</span>
                <span>{props.userData.wins}</span>
            </div>

            <div className={style.infoRow}>
                <span>Defeats</span>
                <span>{props.userData.losses}</span>
            </div>

            <div className={style.infoRow}>
                <span>Winning rate</span>
                <span>{winRate(props.userData)} %</span>
            </div>

            <div className={style.infoRow}>
                <span>Coins</span>
                <span>{props.userData.coins}</span>
            </div>

            <div className={style.infoRow}>
                <span>Points</span>
                <span>{props.userData.points}</span>
            </div>
        </div>}


        {chooseProfile && <div className={style.chooseProfileContainer}>
            <button className={style.removeDefault + " " + style.back} onClick={() => setChooseProfile(false)}>
                <img src={"/images/back.png"} alt={"go back"}/>
            </button>

            <h3>Choose a new profile picture</h3>
            <div>
                {profileImages}
            </div>
        </div>}

    </dialog>;
}

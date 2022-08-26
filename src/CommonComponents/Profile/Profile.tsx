import {useContext, useEffect, useRef, useState} from "react";
import style from "./profile.module.scss";
import {GlobalContext, postRequest, winRate} from "../../Global";
import {getAuth} from "firebase/auth";

type Props = {
    close: () => void;
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
        getAuth().signOut();
        props.close();
    }

    const setNewProfileImage = async (image: number) => {
        await postRequest("/general/changeProfileImage", {
            image: image,
            name: globalContext.userData.name
        })
        setChooseProfile(false);
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
                    <img src={"/images/x.png"}/>
                </button>
                <button className={style.signOut} onClick={signOut}>Sign Out</button>
            </div>

            <span className={style.name}>{globalContext.userData.displayName}</span>

            <button className={style.removeDefault} onClick={() => setChooseProfile(true)}>
                <img src={`/images/p${globalContext.userData.image}.png`} className={style.profileImage}/>
            </button>

            <div className={style.infoRow}>
                <span>Victories</span>
                <span>{globalContext.userData.wins}</span>
            </div>

            <div className={style.infoRow}>
                <span>Defeats</span>
                <span>{globalContext.userData.losses}</span>
            </div>

            <div className={style.infoRow}>
                <span>Winning rate</span>
                <span>{winRate(globalContext.userData)} %</span>
            </div>

            <div className={style.infoRow}>
                <span>Coins</span>
                <span>{globalContext.userData.coins}</span>
            </div>

            <div className={style.infoRow}>
                <span>Points</span>
                <span>{globalContext.userData.points}</span>
            </div>
        </div>}


        {chooseProfile && <div className={style.chooseProfileContainer}>
            <button className={style.removeDefault + " " + style.back} onClick={() => setChooseProfile(false)}>
                <img src={"/images/back.png"}/>
            </button>

            <h3>Choose a new profile picture</h3>
            <div>
                {profileImages}
            </div>
        </div>}

    </dialog>;
}

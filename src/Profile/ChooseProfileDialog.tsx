import {useEffect, useRef} from "react";
import style from "../CommonComponents/Profile/profile.module.scss";
import {UserData} from "../DataTypes";
import {postRequest} from "../Global";

type Props = {
    close: () => void;
    userData: UserData;
}

export function ChooseProfileDialog(props: Props) {
    const profileRef = useRef<HTMLDialogElement>()

    useEffect(() => {
        if (profileRef.current && !profileRef.current.open) {
            profileRef.current.showModal();
        }
    }, [])

    const setNewProfileImage = async (image: number) => {
        await postRequest("/general/changeProfileImage", {
            image: image,
            name: props.userData.name
        })
        props.close();
    }

    const profileImages = []
    for (let i = 1; i <= 18; i++) {
        profileImages.push(<button key={i} className={style.removeDefault} onClick={() => setNewProfileImage(i)}>
            <img src={`/images/p${i}.png`} alt={`profile ${i}`}/>
        </button>)
    }

    return <dialog ref={profileRef} className={style.profileDialog}>
        <div className={style.chooseProfileContainer}>
            <button className={style.removeDefault + " " + style.back} onClick={props.close}>
                <img src={"/images/back.png"} alt={"go back"}/>
            </button>

            <h3>Choose a new profile picture</h3>
            <div>
                {profileImages}
            </div>
        </div>
    </dialog>;
}

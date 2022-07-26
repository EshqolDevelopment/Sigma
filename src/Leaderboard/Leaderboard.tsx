import React, {useEffect, useState} from "react";
import {app} from "../init/firebase";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import "./Leaderboard.scss";
import {countryCodeEmoji} from "country-code-emoji";
import {useQuery} from "react-query";
import Footer from "../CommonComponents/Footer/Footer";
import Loading from "../CommonComponents/Loading/Loading";
import {Helmet} from "react-helmet";
import {Profile} from "../CommonComponents/Profile/Profile";
import {UserData} from "../DataTypes";
import {postRequest} from "../Global";

export default function Leaderboard() {
    const {data, isLoading} = useQuery(["leaderboard"], getLeaderboardData);
    const [chosenProfileData, setChosenProfileData] = useState<UserData>(null);

    async function getLeaderboardData() {
        const ref = doc(getFirestore(app), "leaderboard/leaderboard");
        const res = await getDoc(ref);
        return res.data()["leaderboard"].split("@");
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#d0d6e0");
    }, []);

    const openProfile = async (username: string) => {
        setChosenProfileData({} as any);
        const userData = await postRequest("/general/getUserData", {name: username}) as UserData;
        setChosenProfileData(userData);
    }

    const getEmoji = (c: string) => {
        let country = c.toLowerCase();
        if (c === "") return "🌎";
        if (c === "uk") return "🇬🇧"

        try {
            return countryCodeEmoji(country)
        } catch (e) {
            return "🌎";
        }
    }

    const getImage = (c: string) => {
        if (c === "undefined") return "guest"
        return c
    }

    const split = (data: string) => {
        const arr = data.split(".")
        const len = arr.length;

        if (len === 4) return arr

        if (len > 4) {
            const image = arr[len - 1];
            const score = arr[len - 2];
            const country = arr[len - 3];
            let name = arr[0];
            for (let i = 1; i < len - 3; i++) name += "." + arr[i];
            return [name, country, score, image]
        }
        return ["user", "", "0", "undefined"]
    }

    if (isLoading) return <Loading/>;

    return (
        <>
            <Helmet>
                <title>Leaderboard | Sigma Code Wars</title>
                <meta name={"description"} content={"See your rank on the Sigma Code Wars leaderboard"}/>
            </Helmet>

            <main className={"leaderboard-content"}>
                {data?.length > 0 && <div className={"title-row"}>
                    <span>Rank</span>
                    <span>Name</span>
                    <span>Score</span>
                </div>}

                {data?.map((item, index) => {
                        const [name, country, score, image] = split(item);

                        return (
                            <div key={index} onClick={() => openProfile(name)}>
                                <div className={"rightSide"}>
                                    <span className={"num"}>#{index + 1}</span>
                                    <span className={"flag"}>{getEmoji(country)}</span>
                                    <button className={"removeDefault personProfileContainer"}>
                                        <img className={"person"} src={`/images/p${getImage(image)}.png`} alt={name}/>
                                    </button>
                                </div>

                                <span className={"itemName"}>{name.replaceAll("_", "")}</span>
                                <span className={"itemScore"}>{score}</span>
                            </div>
                        );
                    }
                )}
            </main>

            {chosenProfileData && <Profile close={() => setChosenProfileData(null)} userData={chosenProfileData}/>}

            <Footer/>
        </>

    );
}

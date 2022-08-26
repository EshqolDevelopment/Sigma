import React, {useEffect} from "react";
import {app} from "../init/firebase";
import {doc, getDoc, getFirestore} from "firebase/firestore";
import "./Leaderboard.scss";
import {countryCodeEmoji} from "country-code-emoji";
import {useQuery} from "react-query";


export default function Leaderboard() {
    const {data} = useQuery(['leaderboard'], getLeaderboardData)

    async function getLeaderboardData() {
        const ref = doc(getFirestore(app), 'leaderboard/leaderboard')
        const res = await getDoc(ref)
        return res.data()['leaderboard'].split('@')
    }

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#d0d6e0");
    }, [])

    function openProfile() {
        console.log("aaa")
    }

    return (
        <div className={'leaderboard-content'}>

            {data?.length > 0 && <div className={'title-row'}>
                <span>Rank</span>
                <span>Name</span>
                <span>Score</span>
            </div>}

            {data?.map((item, index) => {
                    const [name, country, score, image] = item.split('.')
                    return (
                        <div key={index}>
                            <div className={"leftSide"}>
                                <span className={"num"}>#{index + 1}</span>
                                <span className={'flag'}>{countryCodeEmoji(country === '' ? 'us' : country)}</span>
                                <img className={"person"} src={`/images/p${image === 'undefined' ? "guest" : image}.png`}
                                     alt={name} onClick={openProfile}/>
                            </div>

                            <span className={"itemName"}>{name.replaceAll('_', '')}</span>
                            <span className={"itemScore"}>{score}</span>
                        </div>
                    )
                }
            )}
        </div>
    )
}

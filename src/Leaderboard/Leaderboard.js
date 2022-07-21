import React, { useState, useEffect } from 'react';
import { app } from '../init/firebase';
import { doc, getDoc, getFirestore } from "firebase/firestore";
import './Leaderboard.css'
import { countryCodeEmoji } from 'country-code-emoji'



export default function Leaderboard() {


    const [data, setData] = useState([])

    useEffect(() => {

        const ref = doc(getFirestore(app), 'leaderboard/leaderboard')
        getDoc(ref).then(res => {

            const data = res.data()['leaderboard'].split('@')
            setData(data)
        })

    }, [])


    return (
        <div className={'leaderboard-content'}>

            <div className={'title-row'}>
                <span>Rank</span>
                <span>Name</span>
                <span>Score</span>
            </div>

            {data.map((item, index) => {
                const [name, country, score, image] = item.split('.')
                return (
                    <div key={index}>
                        <div>
                            <span>#{index + 1}</span>
                            <span className={'flag'}>{countryCodeEmoji(country === '' ? 'us' : country)}</span>
                            <img src={require(`../Photos/p${image === 'undefined' ? "guest" : image}.png`)} alt={name}/>
                        </div>

                        <span>{name.replaceAll('_', '')}</span>
                        <span>{score}</span>
                    </div>
                )}
            )}
        </div>
    )
}
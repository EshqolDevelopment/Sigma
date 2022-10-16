import React, {useContext, useEffect} from "react";
import s from "./Profile.module.scss";
import {
    AnyHistory,
    QuickPlayHistory,
    Result,
} from "./ProfileTypes";
import {Level} from "../DataTypes";
import {GlobalContext, postRequest} from "../Global";
import Loader from "../CommonComponents/Loading/Loader";
import {useQuery} from "react-query";


const LevelLabel = (props: {level: Level}) => {
    if (props.level === 'easy')
        return <span style={{color: 'forestgreen'}}>Easy</span>;

    if (props.level === 'medium')
        return <span style={{color: 'orange'}}>Medium</span>;

    if (props.level === 'hard')
        return <span style={{color: 'red'}}>Hard</span>;
}

const ResultLabel = (props: {result: Result}) => {
    if (props.result > 0)
        return <span className={s.win}>Win!</span>;

    else if (props.result < 0)
        return <span style={{color: 'red'}}>Lose</span>;

    else
        return <span style={{color: 'dodgerblue'}}>Draw</span>;
}

const DurationLabel = (props: {duration: number}) => {
    const hours = Math.floor(props.duration / 3600);
    const minutes = Math.floor((props.duration - hours * 3600) / 60);
    const seconds = props.duration - hours * 3600 - minutes * 60;

    if (hours > 0)
        return <span>{hours}:{minutes}:{seconds} hours</span>;

    if (minutes > 0)
        return <span>{minutes}:{seconds} minutes</span>;

    return <span>{seconds} seconds</span>;
}

const QuickPlay = (props: {history: QuickPlayHistory}) => {
    const history = props.history;
    const questions = history.questionsData;
    const date = new Date(history.date).toLocaleDateString() + " " +
        new Date(history.date).getHours() + ":" + new Date(history.date).getMinutes();

    let [player, opponent] = [0, 0]
    for (let i = 0; i < questions.length; i++) {
        if (questions[i].result === 1)
            player++;

        else if (questions[i].result === -1)
            opponent++;

        else {
            player++;
            opponent++;
        }
    }

    return <div className={s.quickplay}>
        <div>
            <b>QuickPlay</b>
            <span>{player} - {opponent}</span>
            <LevelLabel level={history.level}/>
        </div>

        <div>
            <ResultLabel result={player - opponent as Result}/>
            <span>{history.opponent}</span>
        </div>

        <p className={s.date}>{date}</p>
    </div>
}


export default function History() {
    const globalContext = useContext(GlobalContext);
    const historyQuery = useQuery(["history"], async () => {
        const res = await postRequest("/general/getHistory", {
            name: globalContext.userData.name
        }) as {history: AnyHistory[]};

        return res.history;
    }, {
        enabled: !!globalContext.userData?.name,
    });

    const history = historyQuery.data;

    if (historyQuery.isLoading || !history) {
        return <Loader/>
    }

    return <div className={s.history}>
        {history.map((item, index) => {
            if (item.mode === "quick")
                return <QuickPlay history={item as QuickPlayHistory}/>

            return null;
        })}
    </div>
}

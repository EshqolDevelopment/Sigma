import React, {useContext, useEffect} from "react";
import s from "./Profile.module.scss";
import {
    AnyHistory, MultiplayerHistory,
    QuickPlayHistory,
    Result, SinglePlayerHistory
} from "./ProfileTypes";
import {Level} from "../DataTypes";
import {formatName, GlobalContext, postRequest} from "../Global";
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

const formatDate = (date: number) => {
    return new Date(date).toLocaleDateString("en-IL") + " " +
        new Date(date).getHours() + ":" + new Date(date).getMinutes();
}

const QuickPlay = (props: {history: QuickPlayHistory}) => {
    const history = props.history;
    const questions = history.questionsData;
    const date = formatDate(history.date);

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
            <b>Quick Play</b>
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

const MultiPlay = (props: {history: MultiplayerHistory}) => {
    const globalContext = useContext(GlobalContext);
    const history = props.history;
    const date = formatDate(history.date);

    const formatsPlayer = history.players.map((player) => formatName(player));

    const place = history.times.findIndex((time) => time.name === globalContext.userData?.name);
    const placeToName = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th"];

    return <div className={s.quickplay}>
        <div>
            <b>Multi Player</b>
            <LevelLabel level={history.level}/>
        </div>

        <div>
            <span className={s.place}>{placeToName[place]}</span>
            <span className={s.players}>{formatsPlayer.join("\n")}</span>
        </div>

        <div>
            Finish Time: <DurationLabel duration={history.times.find((time) => time.name === globalContext.userData.name)?.time/1000 as number}/>
        </div>

        <p className={s.date}>{date}</p>
    </div>

}

const SinglePlay = (props: {history: SinglePlayerHistory}) => {
    const history = props.history;
    const date = formatDate(history.date);

    return <div className={s.quickplay}>
        <div>
            <b>Single Play</b>
            {history.record && <span className={s.record}>Record</span>}
            <LevelLabel level={history.level}/>
        </div>

        <div>
            Time Per Question: <DurationLabel duration={history.timePerQuestion}/>
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

    const quickPlays = history.filter((history) => history.mode === 'quick') as QuickPlayHistory[];
    const multiPlays = history.filter((history) => history.mode === 'multi') as MultiplayerHistory[];
    const singlePlays = history.filter((history) => history.mode === 'single') as SinglePlayerHistory[];

    return <div>

        <div  className={s.modeContainer}>
            <h3>Quick Play</h3>
            <div className={s.history}>
                {quickPlays.map((history) => <QuickPlay history={history}/>)}
            </div>
        </div>

        <div  className={s.modeContainer}>
            <h3>Multi Player</h3>
            <div className={s.history}>
                {multiPlays.map((history) => <MultiPlay history={history}/>)}
            </div>
        </div>


        <div className={s.modeContainer}>
            <h3>Single Player</h3>
            <div className={s.history}>
                {singlePlays.map((history) => <SinglePlay history={history}/>)}
            </div>
        </div>



    </div>
}

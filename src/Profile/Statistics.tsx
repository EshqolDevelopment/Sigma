import React, {useContext, useEffect, useState} from "react";
import {
    ArcElement,
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip
} from "chart.js";
import {Line, Pie} from "react-chartjs-2";
import s from "./statistics.module.scss";
import {GlobalContext, postRequest} from "../Global";
import {GraphsData} from "./DataTypes";
import {useQuery} from "react-query";
import Loader from "../CommonComponents/Loading/Loader";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    LineElement,
    PointElement
);

// }

export default function Statistics() {
    const globalContext = useContext(GlobalContext);
    const graphsQuery = useQuery(["graphs"], () => postRequest("/statistics/getGraphsData", {
        name: globalContext.userData.name
    }), {
        enabled: !!globalContext.userData?.name,
    });

    const pieGraphConfig = {
        backgroundColor: [
            "rgb(255,0,53)",
            "rgb(54,162,235)",
            "rgb(255,206,86)",
            "rgb(75,192,192)",
            "rgb(153,102,255)",
            "rgb(255,159,64)",
            "rgb(255,99,132)",
            "rgb(128,255,86)",
            "rgb(250,250,0)",
            "rgb(80,42,42)",
            "rgba(208,4,224,0.7)",
            "rgb(0,211,225)",
        ],
        hoverOffset: 10
    }

    const lineGraphConfig = {
        borderColor: 'rgb(75, 192, 192)',
    }

    const getGraph = (name: keyof GraphsData) => {
        return graphsQuery.data?.[name] || {};
    }

    if (graphsQuery.isLoading) {
        return <Loader/>
    }

    return <div className={s.statistics}>

        <div className={s.pieGraphsContainer}>
            <div className={s.pieGraph}>
                <span className={s.graphTitle}>Game Results</span>
                <Pie data={{
                    labels: Object.keys(getGraph("gamesResultsDistribution")),
                    datasets: [{
                        data: Object.values(getGraph("gamesResultsDistribution")),
                        ...pieGraphConfig
                    }]
                }}/>
            </div>

            <div className={s.pieGraph}>
                <span className={s.graphTitle}>Level Distribution</span>
                <Pie data={{
                    labels: Object.keys(getGraph("levelDistribution")),
                    datasets: [{
                        data: Object.values(getGraph("levelDistribution")),
                        ...pieGraphConfig
                    }]
                }}/>
            </div>
        </div>


        <div className={s.lineGraphsContainer}>
            <div className={s.lineGraph}>
                <span className={s.graphTitle}>Coins Over Time</span>
                <Line data={{
                    labels: Object.keys(getGraph("coinsOverTime")),

                    datasets: [{
                        label: "Coins Over Time (Coins)",
                        data: Object.values(getGraph("coinsOverTime")),
                        ...lineGraphConfig
                    }]
                }}
                />
            </div>


            <div className={s.lineGraph}>
                <span>Win Rate Over Time</span>
                <Line data={{
                    labels: Object.keys(getGraph("winRate")),

                    datasets: [{
                        label: "Win Rate Over Time (%)",
                        data: Object.values(getGraph("winRate")),
                        ...lineGraphConfig
                    }]
                }}
                />
            </div>
        </div>



    </div>
}

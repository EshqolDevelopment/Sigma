import React, {useState, useEffect} from "react";
import './ExamsHome.scss';
import {ExamExplorerData} from "../ExamDataTypes";
import Footer from "../../CommonComponents/Footer/Footer";
import MyExams from "../MyExams/MyExams";
import {useNavigate} from "react-router-dom";


export default function ExamsHome() {

    const navigate = useNavigate()


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "white");
    }, []);

    const Box = (props: {title: string, children: string, icon?: string}) => (
        <button className={'box exams-box'}>
            {props.icon && <img src={`/images/${props.icon}.svg`} alt={''}/>}
            <h2>{props.title}</h2>
            <p>{props.children}</p>
            <span>Explore.</span>
        </button>
    )

    return (
        <div>
            <div className={'home-upper exams-upper'}>
                <div className={'home-title exams-header'}>
                    <h1>Sigma - Exams Solutions!</h1>
                    <p>
                        Sigma Exams is the best platform to solve, create and share coding exams.<br/>
                        We provide an easy method to create coding exams for any purpose.<br/>
                        You can also solve exams created by other users and share your own exams with the community.
                    </p>
                    <button className={'sigma-button'} onClick={() => navigate('/explore-exams')}>Explore Now!</button>
                </div>

                <img src={'https://cdn-icons-png.flaticon.com/512/2904/2904768.png'} alt={''}/>
            </div>

            <div className="explorer">
                <h2 className={'exams-title'}>Why choose Sigma Exams?</h2>

                <section className={'about-sigma'}>

                    <Box title={'Advanced AI Scoring System'} icon={'ai'}>
                        We are using advanced AI to score your exams and provide you with the best and most accurate results.
                    </Box>

                    <Box title={'Official Exams'} icon={'check'}>
                        Solve the official exams that has been created by Sigma.
                        these exams are used to test your skills and knowledge.
                    </Box>

                    <Box title={'Wide Range of Statistics'} icon={'stats'}>
                        Once you solve an exam, you will be able to see your statistics and compare your performances with other users.
                    </Box>

                    <Box title={'Multiple Languages'} icon={'globe'}>
                        Most of our exams are available in at least 4 different programming languages.
                    </Box>

                    <Box title={'Exams from Well Known Universities'} icon={'university'}>
                        Some of our exams, are taken from well known universities and are used to test students in their CS courses.
                    </Box>

                    <Box title={'Get Certified'} icon={'certificate'}>
                        Once you solve an exam, you will be able to get a certificate that proves your skills and knowledge.
                    </Box>

                </section>
            </div>

            <Footer/>
        </div>
    )
}
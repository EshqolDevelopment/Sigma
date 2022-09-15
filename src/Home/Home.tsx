import React, {useEffect} from "react";
import "./Home.scss";
import {SampleQuestion} from "./SampleQuestion";
import * as Svg from '../init/Svg'
import { useNavigate } from "react-router-dom";
import Footer from "../CommonComponents/Footer/Footer";
import {Helmet} from "react-helmet";


const languages = {
    'Python': [Svg.Python(), 'Data Scientists & Students'],
    'JavaScript': [Svg.Javascript(), 'Web developers'],
    'Kotlin': [Svg.Kotlin(), 'Android developers'],
    'Java': [Svg.Java(), 'old school programmers'],
    'C#': [Svg.Csharp(), 'Windows & Unity developers'],
}

const languagesList = Object.keys(languages);

const realtime = {
    'Up to 5 Questions per Game': [Svg.Trophy(), 'the first one to answer 3 correctly wins, with maximum of 5 per game'],
    '4 Different Levels': [Svg.Level(), 'choose the right one for you out of: Beginner, Easy, Medium and Hard'],
    "Don't waste the time": [Svg.Hourglass(), "it's all about time, so always try to answer the question as fast as possible"]
}

const friends = {
    'Solve in your own pace': [Svg.Running(), 'in the multiplayer mode, each player continues to the next question, and not disturbing the other players'],
    'Improve together': [Svg.HandShake(), 'without any doubt, challenge your friends is the best way to become a coding master'],
    'Customize your game': [Svg.Settings(), 'modify the number of questions, the level and the language of the game to fit your goals']
}

const leaderboard = {
    'Coins': [Svg.Coins(), 'the base number is the amount of coins you have'],
    'Wins': [Svg.Medal(), 'Add the number of wins you have, each win is worth 10 points'],
    'Winrate': [Svg.Percentage(), 'Now multiply it by your winrate, for instance if your winrate is 65%, then multiply it by 0.65']
}

const ide = {
    'Syntax Highlighting': [Svg.Marker(), "there's no need to explain why is it so important..."],
    'Line Numbering': [Svg.Numbering(), 'to help you track your code'],
}


export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.documentElement.style.setProperty("--background", "white");
    }, [])


    const Box = (props: {title: string, children: string, icon?: string, viewBox?: string, fill?: boolean,
        strokeLine?: "butt" | "round" | "square" | "inherit", strokeWidth?: string, id: string}) => (

            <button className={'box'} onClick={() => props.id === 'questions' ? navigate("/practice") : document.getElementById(props.id).scrollIntoView({
                behavior: 'smooth',
                block: 'start',
                inline: 'center'
            })}>
                { props.icon &&
                    <svg viewBox={props.viewBox || "0 0 24 24"} xmlns="http://www.w3.org/2000/svg">
                        <path fill={props.fill ? "#3d73e7" : "none"} strokeLinecap={props.strokeLine || "butt"} stroke="#3d73e7" strokeWidth={props.strokeWidth || "2"} d={props.icon}/>
                    </svg> }
                <h2>{props.title}</h2>
                <p>{props.children}</p>
                <span>Learn more.</span>
            </button>
    )




    const List = (props) => {
        return <>
            { Object.keys(props.data).map((key, index) => (
                <div key={index}>
                    {props.data[key][0]}
                    <span>
                        {key}<span>{props.children}{props.data[key][1]}</span>
                    </span>
                </div>
            ))}
        </>
    }


    const ReadMore = (props) => (
        <div id={props.id || ''}>
            <div className={'line-separating'}/>

            <div className={'details'}>
                <div className={'details-title'}>
                    <h2>{props.title}</h2>
                    <span>{props.children}</span>

                    <div className={'details-list'}>
                        <List data={props.list}>{props.seperator || ' - '}</List>
                    </div>
                </div>
            </div>
        </div>
    )


    return (
        <div>

            <Helmet>
                <title>Sigma - Code Wars</title>
                <meta name={"description"} content={"Sigma is a platform that helps you to improve your coding skills by competing with your friends and other players in coding questions in real-time"}/>
            </Helmet>

            <main>
                <div className={'home-content'}>
                    <div className={'home-upper'}>
                        <div className={'home-title'}>
                            <h1>Sigma - Code Wars!</h1>
                            <p>The first and only platform enabling you to compete in coding challenges.<br/>
                                Over 200 questions & multi language support!<br/>
                                Become fast, clever and a part of the coding community.
                            </p>
                            <button className={'sigma-button'} onClick={() => navigate("/play")}>Play Now!</button>
                        </div>

                        <SampleQuestion/>
                    </div>

                    <h2 className={'what-is-sigma'}>Why choose sigma?</h2>

                    <section className={'about-sigma'}>
                        <Box id={'realtime'} title={'Real-time Competition'} strokeLine={"round"} icon={"M17 20v-1m0-4v-1M7 4v16m0 0-3-3m3 3 3-3m7-7V4m0 0-3 3m3-3 3 3"}>
                            Our main expertise is to provide real-time competition between players.
                            Rules are easy: whoever solves the question first wins!
                        </Box>

                        <Box id={'questions'} title={'200+ Challenging Questions'} strokeWidth={"0"} fill={true} icon={"M3 4.075a.423.423 0 0 0 .43.44H4.9c.247 0 .442-.2.475-.445.159-1.17.962-2.022 2.393-2.022 1.222 0 2.342.611 2.342 2.082 0 1.132-.668 1.652-1.72 2.444-1.2.872-2.15 1.89-2.082 3.542l.005.386c.003.244.202.44.446.44h1.445c.247 0 .446-.2.446-.446v-.188c0-1.278.487-1.652 1.8-2.647 1.086-.826 2.217-1.743 2.217-3.667C12.667 1.301 10.393 0 7.903 0 5.645 0 3.17 1.053 3.001 4.075zm2.776 10.273c0 .95.758 1.652 1.8 1.652 1.085 0 1.832-.702 1.832-1.652 0-.985-.747-1.675-1.833-1.675-1.04 0-1.799.69-1.799 1.675z"}>
                            If you want to become a professional coder, sigma is your way to go!
                            With over 200 questions spanning 10 categories and 3 difficulty levels,
                            you’ll be a pro in no time!
                        </Box>

                        <Box id={'language'} title={`Supporting ${languagesList.length} Languages`} icon={"M12,23 C18.0751322,23 23,18.0751322 23,12 C23,5.92486775 18.0751322,1 12,1 C5.92486775,1 1,5.92486775 1,12 C1,18.0751322 5.92486775,23 12,23 Z M12,23 C15,23 16,18 16,12 C16,6 15,1 12,1 C9,1 8,6 8,12 C8,18 9,23 12,23 Z M2,16 L22,16 M2,8 L22,8"}>
                            {`Not everyone code in the same language, so we let you solve the questions in your favorite one out of:&nbsp;
                    ${languagesList.slice(0, -1).join(', ')} and ${languagesList[languagesList.length - 1]}.`}
                        </Box>

                        <Box id={'friends'} title={'Challenge Your Friends'} fill={true} viewBox="0 -64 640 640" icon={"M192 256c61.9 0 112-50.1 112-112S253.9 32 192 32 80 82.1 80 144s50.1 112 112 112zm76.8 32h-8.3c-20.8 10-43.9 16-68.5 16s-47.6-6-68.5-16h-8.3C51.6 288 0 339.6 0 403.2V432c0 26.5 21.5 48 48 48h288c26.5 0 48-21.5 48-48v-28.8c0-63.6-51.6-115.2-115.2-115.2zM480 256c53 0 96-43 96-96s-43-96-96-96-96 43-96 96 43 96 96 96zm48 32h-3.8c-13.9 4.8-28.6 8-44.2 8s-30.3-3.2-44.2-8H432c-20.4 0-39.2 5.9-55.7 15.4 24.4 26.3 39.7 61.2 39.7 99.8v38.4c0 2.2-.5 4.3-.6 6.4H592c26.5 0 48-21.5 48-48 0-61.9-50.1-112-112-112z"}>
                            We support multiplayer mode, so you can challenge up to 5 of your friends and have fun!
                        </Box>

                        {/*<Box id={'ide'} title={'User Friendly IDE'} strokeLine={'round'} icon={"M3.2 14.222V4a2 2 0 0 1 2-2h13.6a2 2 0 0 1 2 2v10.222m-17.6 0h17.6m-17.6 0-1.48 5.234A2 2 0 0 0 3.644 22h16.712a2 2 0 0 0 1.924-2.544l-1.48-5.234 M11 19L13 19"}>*/}
                        {/*    We are doing our best to provide great experience for you,*/}
                        {/*    And hence our IDE is designed for these purposes, with color coding & syntax highlighting.*/}
                        {/*</Box>*/}

                        <Box id={'exams'} title={'Create Your own Exams'} strokeLine={'round'} icon={"M3.2 14.222V4a2 2 0 0 1 2-2h13.6a2 2 0 0 1 2 2v10.222m-17.6 0h17.6m-17.6 0-1.48 5.234A2 2 0 0 0 3.644 22h16.712a2 2 0 0 0 1.924-2.544l-1.48-5.234 M11 19L13 19"}>
                            With Sigma Tests, you can create your own exams and share them with your friends, students, interviewers or anyone else!
                        </Box>


                        <Box id={'leaderboard'} title={'Compare Yourself to Others'} viewBox="0 0 512 512"  fill={true} icon={"M256 25c-11.594 0-23 12.8-23 31s11.406 31 23 31 23-12.8 23-31-11.406-31-23-31zm-103.951 2.975l-16.098 8.05c15.092 30.185 51.37 56.81 82.188 74.442L232.334 295H247V192h18v103h14.666l14.195-184.533c30.818-17.632 67.096-44.257 82.188-74.442l-16.098-8.05c-19.91 29.9-44.891 49.148-71.334 57.77C281.311 97.28 269.75 105 256 105c-13.75 0-25.31-7.72-32.617-19.256-26.443-8.62-51.424-27.87-71.334-57.77zM169 313v96H25v78h462v-30H343V313H169z"}>
                            Our leaderboard to compare your performance to others, so you can challenge yourself to be the best!
                        </Box>
                    </section>

                    <section>
                        <ReadMore id={'language'} title={`We Support ${languagesList.length} Different Languages.`} list={languages} seperator={', for '}>
                            There's nothing more frustrating than finding the perfect question,
                            and them find out it only support a programming language that you don't know.
                            That's why all of our questions come with complete written solutions in {languagesList.length} popular languages.
                        </ReadMore>
                    </section>

                    <section>
                        <ReadMore id={'realtime'} title={'Play and Compete in Real Time.'} list={realtime}>
                            Choose the difficulty level that fits you, and start playing right away.
                            In each game, you'll be competing against other players and the first one to solve 3 questions wins the game!
                        </ReadMore>
                    </section>

                    <section>
                        <ReadMore id={'friends'} title={'Play With your Friends.'} list={friends}>
                            Do you think you can beat your friends? We have a multiplayer mode, where you can challenge up to 5 of
                            your friends and customize your game settings, to fit your needs.
                        </ReadMore>
                    </section>

                    <section>
                        <ReadMore id={'leaderboard'} title={'Leaderboard and Scoring.'} list={leaderboard}>
                            If you are as competitive as we are, then you'll like our leaderboard.<br/>
                            Our leaderboard is calculated based on each player's performance, and the top 100 players will be displayed there!<br/>
                            How are points calculated?
                        </ReadMore>
                    </section>

                    <section>
                        <ReadMore id={'ide'} title={'The Perfect Development Environment.'} list={ide}>
                            Have you ever programmed in notepad? or even worse, with a pen and paper?<br/>
                            If so then you know how it feels to be stuck in a maze of code, where everything is a mass and looks the same.<br/>
                            To avoid this, we have a user-friendly IDE that make your experience much more enjoyable.
                        </ReadMore>
                    </section>

                    <Footer/>
                </div>
            </main>


        </div>

    );
}

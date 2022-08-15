import React, {useEffect, useState} from "react";
import "./Home.scss";
import "./sampleQuestion.scss";
import Editor from "../init/Editor";


export default function Home() {
    // const username = "Nadav";
    // const [showQuickPlayModal, setShowQuickPlayModal] = useState(false)
    // const [showMultiplayerModal, setShowMultiplayerModal] = useState(false)
    const [sampleQuestionCode, setSampleQuestionCode] = useState("def is_prime(number: int) -> bool: \n    ")


    useEffect(() => {
        document.documentElement.style.setProperty("--background", "#5155bd");
    }, [])


    const Box = (props) => {
        return (
            <div className={'box'}>
                <h2>{props.title}</h2>
                <p>{props.children}</p>
                <span>Learn more.</span>
            </div>
        )
    }

    const Spacer = () => {
        return (
            <div className={'line-separating'}/>
        )
    }

    return (
        <div className={'home-content'}>

            <div className={'home-upper'}>
                <div className={'home-title'}>
                    <h1>Sigma - Code Wars!</h1>
                    <p>The first and only platform enabling you to compete in coding challenges.<br/>
                        Over 200 questions & multi language support!<br/>
                        Become fast, clever and a part of the coding community.
                    </p>
                    <button className={'sigma-button'}>Play Now!</button>
                </div>

                <div className={'sample-question'}>
                    <div className={'sample-question-title'}>
                        <h4>Is Prime?</h4>
                        <button className={'submit-button'}>Submit</button>
                    </div>

                    <div className={'sample-question-body'}>
                        <p>Write a function that determinate if a given number is prime</p>
                        <Editor code={sampleQuestionCode} setCode={setSampleQuestionCode} lineNumbers={false}/>
                    </div>
                </div>
            </div>

            <h1 className={'what-is-sigma'}>Why choose sigma?</h1>

            <div className={'about-sigma'}>
                <Box title={'Real-time Competition'}>
                    Our main expertise is to provide real-time competition between players.
                    Rules are easy: whoever solves the question first wins!
                </Box>

                <Box title={'200+ Challenging Questions'}>
                    If you want to become a professional coder, sigma is your way to go!
                    With over 200 questions spanning 10 categories and 3 difficulty levels,
                    you’ll be a pro in no time!
                </Box>

                <Box title={'Supporting 5 Languages'}>
                    Not everyone code in the same language, so we let you solve the questions in your favorite one out of:
                    Python, JavaScript, Kotlin, Java and TypeScript.
                </Box>

                <Box title={'Challenge Your Friends'}>
                    We support multiplayer mode, so you can challenge up to 5 of your friends and have fun!
                </Box>

                <Box title={'User Friendly IDE'}>
                    We are doing our best to provide great experience for you,
                    And hence our IDE is designed for these purposes, with color coding & syntax highlighting.
                </Box>

                <Box title={'Compare Yourself to Others'}>
                    Our leaderboard to compare your performance to others, so you can challenge yourself to be the best!
                </Box>
            </div>

            <Spacer/>

            <div className={'languages'}>
                <h1>We Support 5 Different Languages.</h1>
                <span>
                    There's nothing more frustrating than finding the perfect question,
                    and them find out it only support a programming language that you don't know.
                    That's why all of our questions come with complete written solutions in 5 popular languages.
                </span>

                <div className={'languages-list'}>
                    <span>Python</span>
                    <span>JavaScript</span>
                    <span>Kotlin</span>
                    <span>Java</span>
                    <span>TypeScript</span>
                </div>
            </div>

            <Spacer/>


            {/*<h1 className={'home-title'}>Welcome {username}!</h1>*/}

            {/*<p className={'description'}>*/}
            {/*    In Sigma, we provide the best way to learn and improve your coding skills to become a professional*/}
            {/*    programmer.*/}
            {/*    <br/><br/>*/}
            {/*    Sigma is the first app enabling users to compete against each other in coding challenges in real-time.*/}
            {/*    <br/><br/>*/}
            {/*    In addition, Sigma has a vast collection of Python programming challenges, starting from complete*/}
            {/*    beginner's level to professional expert's level, which you can practice and solve as you want.*/}
            {/*    <span>*/}
            {/*        <br/><br/>*/}
            {/*        Check if a string is a palindrome? Print all the prime numbers between 1 to 100. Given there are two queens on a chessboard, check if they could attack each other. Check if 4 points on the x, y plane form a square.*/}
            {/*        <br/><br/>*/}
            {/*        Become fast and clever, plus become a part of the coding community.*/}
            {/*    </span>*/}
            {/*</p>*/}

            {/*<div className={'buttons-home-screen'}>*/}
            {/*    <button className={'sigma-button'} onClick={() => setShowQuickPlayModal(true)}>Quick Play</button>*/}
            {/*    <button className={'sigma-button'} onClick={() => setShowMultiplayerModal(true)}>Play with friends</button>*/}
            {/*</div>*/}

            {/*{showQuickPlayModal && <QuickPlayModal show={showQuickPlayModal} setShow={setShowQuickPlayModal}/>}*/}
            {/*{showMultiplayerModal && <MultiPlayerModal show={showMultiplayerModal} setShow={setShowMultiplayerModal}/>}*/}

            {/*<img*/}
            {/*    src={'https://d3nn82uaxijpm6.cloudfront.net/assets/marketing/btn-google-play-1af0a2be816284e40414957321dc112dc8ed3e1f7de6d3d0b0dad8787ed58028.svg'}*/}
            {/*    alt={'Get it on Google Play'}*/}
            {/*    className={'google-play-button'}*/}
            {/*/>*/}

        </div>
    );
}
import React from 'react';
import './Home.css'


export default function Home() {

    const username = 'Yoav'

    return (
        <div className={'home-content'}>
            <h1 className={'home-title'}>Welcome {username}!</h1>

            <p className={'white no-break p18'}>
                In Sigma, we provide the best way to learn and improve your coding skills to become a professional programmer.
                <br/><br/>
                Sigma is the first app enabling users to compete against each other in coding challenges in real-time.
                <br/><br/>
                In addition, Sigma has a vast collection of Python programming challenges, starting from complete beginner's level to professional expert's level, which you can practice and solve as you want.
                <br/><br/>
                Check if a string is a palindrome? Print all the prime numbers between 1 to 100. Given there are two queens on a chessboard, check if they could attack each other. Check if 4 points on the x, y plane form a square.
                <br/><br/>
                Become fast and clever, plus become a part of the coding community.
            </p>

            <div className={'buttons-home-screen'}>
                <buttom className={'sigma-button'}>Quick Play</buttom>
                <buttom className={'sigma-button'}>Play with friends</buttom>
            </div>

            <img src={'https://d3nn82uaxijpm6.cloudfront.net/assets/marketing/btn-google-play-1af0a2be816284e40414957321dc112dc8ed3e1f7de6d3d0b0dad8787ed58028.svg'} alt={'Get it on Google Play'} className={'google-play-button'}/>
        </div>
    );
}
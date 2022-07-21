import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './init/index.css';
import Home from "./Home/Home";
import NavigationBar from "./init/NavigationBar";
import ListOfQuestions from "./Practice/List/ListOfQuestions";
import Question from "./Practice/Question/Question";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler/Compiler";


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <div>
        <NavigationBar/>

        <div className={'content'}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/home" element={<Home/>}/>

                    <Route path="/leaderboard" element={<Leaderboard/>}/>
                    <Route path="/compiler" element={<Compiler/>}/>

                    <Route path="/practice" element={<ListOfQuestions/>}/>
                    <Route path="/practice/*" element={<Question/>}/>

                    <Route path="*" element={<Home/>}/>
                </Routes>
            </BrowserRouter>
        </div>
    </div>
);
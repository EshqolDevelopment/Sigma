import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import "./init/index.css";
import Home from "./Home/Home";
import NavigationBar from "./init/NavigationBar";
import Question from "./Practice/Question/Question";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler/Compiler";
import Container from "./Practice/List/Container";
import {getAuth, User} from "firebase/auth";
import {createContext} from "react";

const root = ReactDOM.createRoot(document.getElementById("root"));

type GlobalContextType = {
    user: User
}

export const GlobalContext = createContext<GlobalContextType>(null);

function App() {
    const [firebaseUser, setFirebaseUser] = React.useState(undefined as User);

    getAuth().onAuthStateChanged(user => {
        if (user) {
            setFirebaseUser(user);
        } else {
            setFirebaseUser(null);
        }
    })

    return (
        <GlobalContext.Provider value={{
            user: firebaseUser
        }}>
            <div>
                <NavigationBar/>

                <div className={"content"}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/home" element={<Home/>}/>

                            <Route path="/leaderboard" element={<Leaderboard/>}/>
                            <Route path="/compiler" element={<Compiler/>}/>

                            <Route path="/practice" element={<Container/>}/>
                            <Route path="/practice/*" element={<Question/>}/>

                            <Route path="*" element={<Home/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </GlobalContext.Provider>

    )
}


root.render(
    <App/>
);

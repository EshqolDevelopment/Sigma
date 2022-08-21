import React, {createContext} from "react";
import {getAuth, User} from "firebase/auth";
import NavigationBar from "./init/NavigationBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home/Home";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler/Compiler";
import Container from "./Practice/List/Container";
import Question from "./Practice/Question/Question";
import Play from "./Play/Play";

type GlobalContextType = {
    user: User
}
export const GlobalContext = createContext<GlobalContextType>(null);

export type Level = "easy" | "medium" | "hard";

export const postRequest = async (url: string, data: any) => {
    try {
        const response = await fetch(url, {
            body: JSON.stringify(data),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });

        return await response.json();
    } catch (e) {
        return {error: "General error"};
    }

}

export function App() {
    const [firebaseUser, setFirebaseUser] = React.useState(undefined as User);

    getAuth().onAuthStateChanged(user => {
        if (user) {
            setFirebaseUser(user);
        } else {
            setFirebaseUser(null);
        }
    });

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

                            <Route path="/play" element={<Play/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </GlobalContext.Provider>

    );
}

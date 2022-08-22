import React, {createContext} from "react";
import {getAuth} from "firebase/auth";
import NavigationBar from "./init/NavigationBar";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Home from "./Home/Home";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler/Compiler";
import Practice from "./Practice/Practice";
import Play from "./Play/Play";
import PracticeQuestion from "./Practice/PracticeQuestion";

type GlobalContextType = {
    userName: string;
}
export const GlobalContext = createContext<GlobalContextType>(null);

export type Level = "easy" | "medium" | "hard";

export const postRequest = async (url: string = "", data: any) => {
    if (!url.includes("http")) {
        url = process.env["REACT_APP_JS_SERVER_URL"] + url;
    }
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
    const [userName, setUserName] = React.useState<string>(undefined);

    getAuth().onAuthStateChanged(user => {
        if (user) {
            const userEmail = user.email;
            const [name, email] = userEmail.split('@')
            const userName = email !== 'eshqol.com' ? name + '_' : name
            setUserName(userName);
        } else {
            setUserName(null);
        }
    });

    return (
        <GlobalContext.Provider value={{
            userName: userName
        }}>
            <div>

                <div className={"content"}>
                    <BrowserRouter>
                        <NavigationBar/>

                        <Routes>
                            <Route path="/" element={<Home/>}/>
                            <Route path="/home" element={<Home/>}/>

                            <Route path="/leaderboard" element={<Leaderboard/>}/>
                            <Route path="/compiler" element={<Compiler/>}/>

                            <Route path="/practice" element={<Practice/>}/>
                            <Route path="/practice/*" element={<PracticeQuestion/>}/>

                            <Route path="/play" element={<Play/>}/>
                        </Routes>
                    </BrowserRouter>
                </div>
            </div>
        </GlobalContext.Provider>

    );
}

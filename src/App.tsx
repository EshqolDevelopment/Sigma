import React, {useEffect} from "react";
import {getAuth} from "firebase/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from "./init/NavigationBar";
import Home from "./Home/Home";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler/Compiler";
import Practice from "./Practice/Practice";
import PracticeQuestionWrapper from "./Practice/PracticeQuestionWrapper";
import {GlobalContext, postRequest} from "./Global";
import {QuickPlayConfig} from "./Play/QuickPlay/QuickPlayConfig";
import MultiPlayer from "./Play/MultiPlayer/MultiPlayer";
import {ChooseGameMode} from "./Play/Setup/ChooseGameMode";
import {UserData} from "./DataTypes";
import {QueryClient, QueryClientProvider} from "react-query";


export default function App() {
    const [userName, setUserName] = React.useState<string>(undefined);
    const [userData, setUserData] = React.useState<UserData>(undefined);
    const queryClient = new QueryClient()

    getAuth().onAuthStateChanged(user => {
        if (user) {
            const userEmail = user.email;
            const [name, email] = userEmail.split("@");
            const userName = email !== "sigma.com" ? name + "_" : name;
            setUserName(userName);
        } else {
            setUserName(null);
        }
    });

    const getUserData = async (name) => {
        const response = await postRequest("/general/getUserData", {name}) as UserData;
        setUserData(response);
    };

    useEffect(() => {
        if (userName) {
            getUserData(userName);
        } else {
            setUserData(undefined);
        }
    }, [userName]);

    return (
        <QueryClientProvider client={queryClient}>
            <GlobalContext.Provider value={{
                username: userName,
                userData: userData,
            }}>
                <div>
                    <div className={"content"}>
                        <BrowserRouter>
                            <NavigationBar/>

                            <Routes>
                                <Route path={"/"} element={<Home/>}/>
                                <Route path={"/home"} element={<Home/>}/>

                                <Route path={"/leaderboard"} element={<Leaderboard/>}/>
                                <Route path={"/compiler"} element={<Compiler/>}/>

                                <Route path={"/practice"} element={<Practice/>}/>
                                <Route path={"/practice/*"} element={<PracticeQuestionWrapper/>}/>

                                <Route path={"/play"} element={<ChooseGameMode/>}/>
                                <Route path={"/quick-play"} element={<QuickPlayConfig/>}/>
                                <Route path={"/multi-player"} element={<MultiPlayer/>}/>
                            </Routes>
                        </BrowserRouter>
                    </div>
                </div>
            </GlobalContext.Provider>
        </QueryClientProvider>
    );
}

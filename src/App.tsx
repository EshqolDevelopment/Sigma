import React, {useEffect} from "react";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from "./init/NavigationBar";
import Home from "./Home/Home";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler";
import Practice from "./Practice/Practice";
import PracticeQuestionWrapper from "./Practice/PracticeQuestionWrapper";
import {GlobalContext} from "./Global";
import {QuickPlayConfig} from "./Play/QuickPlay/QuickPlayConfig";
import MultiPlayer from "./Play/MultiPlayer/MultiPlayer";
import {ChooseGameMode} from "./Play/Setup/ChooseGameMode";
import {UserData} from "./DataTypes";
import {QueryClient, QueryClientProvider} from "react-query";
import {doc, getFirestore, onSnapshot} from "firebase/firestore";
import {app} from "./init/firebase";
import * as firebaseui from "firebaseui";


const getDisplayName = (username: string): string => {
    let name = username.replaceAll("_", " ").trim();
    return name[0].toUpperCase() + name.slice(1);
}

const formatDBUserData = (name: string, userData: any): UserData => {
    return {
        name: name,
        coins: userData[0],
        wins: userData[1],
        losses: userData[2],
        draws: userData[3],
        points: userData["a"],
        countryCode: userData["c"],
        easyRecord: userData["easy_record"],
        mediumRecord: userData["medium_record"],
        hardRecord: userData["hard_record"],
        image: userData["p"].toString(),
        displayName: getDisplayName(name)
    };
};


let ui = null;

export default function App() {
    const [userName, setUserName] = React.useState<string>(undefined);
    const [userData, setUserData] = React.useState<UserData>(undefined);
    const queryClient = new QueryClient()

    useEffect(() => {
        let uiConfig = {
            signInOptions: [
                {
                    provider: GoogleAuthProvider.PROVIDER_ID,
                    clientId: '794637356909-eirm0bahjum0as2o0mrpjqipchiqp7fo.apps.googleusercontent.com',
                    customParameters: {
                        prompt: 'select_account',
                    },
                }
            ],
            credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
        };

        if (userName === null && !ui) {
            ui = new firebaseui.auth.AuthUI(getAuth());
            ui.start("#helper-firebase-ui", uiConfig);
        }
    }, [userName])


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

    const getUserData = async (username: string) => {
        onSnapshot(doc(getFirestore(app), `root/${username}`), (doc) => {
            const formattedData = formatDBUserData(username, doc.data());
            setUserData(formattedData);
        });
    }

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
                    <div style={{display: "none"}} id={"helper-firebase-ui"}/>

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

import React, {useEffect} from "react";
import {getAuth, GoogleAuthProvider} from "firebase/auth";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NavigationBar from "./init/NavigationBar";
import Home from "./Home/Home";
import Leaderboard from "./Leaderboard/Leaderboard";
import Compiler from "./Compiler/Compiler";
import Practice from "./Practice/Practice";
import PracticeQuestionWrapper from "./Practice/PracticeQuestionWrapper";
import {GlobalContext, postRequest} from "./Global";
import {QuickPlayConfig} from "./Play/QuickPlay/QuickPlayConfig";
import MultiPlayer from "./Play/MultiPlayer/MultiPlayer";
import {ChooseGameMode} from "./Play/Setup/ChooseGameMode";
import {QuestionList, UserData} from "./DataTypes";
import {QueryClient, QueryClientProvider} from "react-query";
import {collection, doc, getFirestore, onSnapshot} from "firebase/firestore";
import {app} from "./init/firebase";
import * as firebaseui from "firebaseui";
import {toast, ToastContainer, Zoom} from "react-toastify";
import NotFound from "./404/NotFound";
import ContactUs from "./ContactUs/ContactUs";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Challenge from "./CommonComponents/DailyChallenge/Challenge";
import {SinglePlayerConfig} from "./Play/SinglePlayer/SinglePlayerConfig";
import Profile from "./Profile/Profile";
import SinglePlayerGame from "./Play/SinglePlayer/SinglePlayerGame";


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
        displayName: getDisplayName(name),
        likes: userData["likes"] || [],
        uid: getAuth().currentUser?.uid,
    };
};


let ui = null;

export default function App() {
    const [userName, setUserName] = React.useState<string>(undefined);
    const [userData, setUserData] = React.useState<UserData>(undefined);
    const [solutions, setSolutions] = React.useState<any>(undefined);
    const [questionNames, setQuestionNames] = React.useState<any>(undefined);
    const [challenges, setChallenges] = React.useState<any>({});
    const queryClient = new QueryClient()

    if ("serviceWorker" in navigator) {
        navigator.serviceWorker.register("/service-worker.js")
    }


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

    const showToast = (message: string, type: "info" | "success" | "error") => {
        const options = {pauseOnHover: false, pauseOnFocusLoss: false, transition: Zoom, draggable: false, closeOnClick: false};
        if (type === "info") toast.info(message, options);
        else if (type === "success") toast.success(message, options);
        else toast.error(message, options);
    }

    const getQuestionNames = async () => {
        return await postRequest("/general/getQuestionNames", {}) as QuestionList;
    }

    useEffect(() => {
        getQuestionNames().then((questionNames) => setQuestionNames(questionNames));
    }, [])

    useEffect(() => {
        getAuth().onAuthStateChanged(async (user) => {
            if (user) {
                const userEmail = user.email;
                const [name, email] = userEmail.split("@");
                const userName = email !== "sigma.com" ? name + "_" : name;
                setUserName(userName);

                const serverResult = await postRequest("/general/onUserCreated", {email: user.email}) as {isNewUser: boolean, error: string};
                if (serverResult.isNewUser) {
                    showToast("Welcome to Sigma!", "success");
                }

                if (serverResult.error) {
                    showToast("An unexpected error occurred", "error");
                }
            } else {
                setUserName(null);
            }
        });
    }, [])


    const formatSolutions = (solutionsDB: {[language: string]: {[question: string]: string}}) => {
        const solutions = {};
        for (const language in solutionsDB) {
            for (const question in solutionsDB[language]) {
                if (!solutions[question]) solutions[question] = {[language]: solutionsDB[language][question]}
                else {
                    solutions[question][language] = solutionsDB[language][question];
                }
            }
        }
        return solutions;
    }

    const getUserData = async (username: string) => {
        onSnapshot(doc(getFirestore(app), `root/${username}`), (doc) => {
            const formattedData = formatDBUserData(username, doc.data());
            setUserData(formattedData);
        });

        onSnapshot(collection(getFirestore(app), `root/${username}/solutions`), (doc) => {
            const solutions = {}
            doc.docs.map((doc) => solutions[doc.id] = doc.data());
            setSolutions(formatSolutions(solutions));
        });

        onSnapshot(collection(getFirestore(app), `root/${username}/challenges`), (doc) => {
            const challenges = {}
            doc.docs.map((doc) => challenges[doc.id] = doc.data());
            setChallenges(challenges);
        })
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
                solutions: solutions,
                showToast: showToast,
                questionNames: questionNames,
                challenges: challenges
            }}>
                <div>
                    <div style={{display: "none"}} id={"helper-firebase-ui"}/>

                    <div className={"content"}>
                        <BrowserRouter>
                            <NavigationBar/>
                            <ToastContainer position={"top-center"}/>

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
                                <Route path={"/contact-us"} element={<ContactUs/>}/>
                                <Route path={"/privacy-policy"} element={<PrivacyPolicy/>}/>
                                <Route path={"/challenge/*"} element={<Challenge/>}/>
                                <Route path={"/single-player"} element={<SinglePlayerConfig/>}/>
                                <Route path={"/profile"} element={<Profile/>}/>
                                <Route path={"/profile/*"} element={<Profile/>}/>
                                <Route path={"/single-player-game"} element={<SinglePlayerGame/>}/>
                                <Route path={"*"} element={<NotFound/>}/>
                            </Routes>
                        </BrowserRouter>
                    </div>
                </div>
            </GlobalContext.Provider>
        </QueryClientProvider>
    );
}

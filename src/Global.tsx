import {createContext} from "react";
import {Solutions, UserData} from "./DataTypes";

type GlobalContextType = {
    username: string;
    userData: UserData;
    solutions: Solutions;
}

export const GlobalContext = createContext<GlobalContextType>(null);


export const postRequest = async (url: string = "", data: any): Promise<object> => {
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

export const winRate = (userData: UserData) => {
    const wins = userData.wins;
    const losses = userData.losses;
    return Math.round((wins / (wins + losses)) * 100 || 0);
}

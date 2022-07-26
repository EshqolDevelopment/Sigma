import {createContext} from "react";
import {Solutions, UserData} from "./DataTypes";

type GlobalContextType = {
    username: string;
    userData: UserData;
    solutions: Solutions;
    showToast: (message: string, type: "info" | "success" | "error") => void;
    questionNames: {
        easy: string[];
        medium: string[];
        hard: string[];
    },
    challenges: {
        [date: string]: {
            easy: boolean;
            medium: boolean;
            hard: boolean;
        }
    }
}

export const GlobalContext = createContext<GlobalContextType>(null);


export const postRequest = async (url: string = "", data: any): Promise<object> => {
    if (!url.includes("http")) {
        const serverUrl = process.env.NODE_ENV === "production" ? process.env["REACT_APP_JS_PROD_SERVER_URL"] : process.env["REACT_APP_JS_DEV_SERVER_URL"];
        url = serverUrl + url;
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

};

export const winRate = (userData: UserData) => {
    const wins = userData.wins;
    const losses = userData.losses;
    return Math.round((wins / (wins + losses)) * 100 || 0);
};

export const questionName = (funcName) => {
    return funcName ? funcName[0].toUpperCase() + funcName.slice(1).replaceAll("_", " ") : "";
};

export function setLocalStorageItemWithExpiry(key, value, expiryTimeInMs) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + expiryTimeInMs
    };
    localStorage.setItem(key, JSON.stringify(item));
}

export function getLocalStorageItemWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    if (!itemStr) {
        return null;
    }
    const item = JSON.parse(itemStr);
    const now = new Date();
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    return item.value;
}

export const formatName = (name: string) =>  {
    const words = name.split("_");
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");
}

export const LevelToCoinsChallenge = {
    easy: 150,
    medium: 300,
    hard: 750
}

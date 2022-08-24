import React, {createContext} from "react";

type GlobalContextType = {
    username: string;
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

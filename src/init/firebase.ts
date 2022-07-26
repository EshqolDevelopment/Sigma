import { initializeApp } from "firebase/app"
import {getDatabase} from "firebase/database";
import { getAnalytics } from "firebase/analytics";


const config = {
    apiKey: "AIzaSyA8E2bTRs949U6XZQTlfByJAzrRT8qoPw4",
    authDomain: "sigmawars.com",
    databaseURL: "https://omega-ad1ba-default-rtdb.firebaseio.com",
    projectId: "omega-ad1ba",
    storageBucket: "omega-ad1ba.appspot.com",
    messagingSenderId: "794637356909",
    appId: "1:794637356909:web:66115f0d9060123f365464",
    measurementId: "G-0X65B808TS"
};

export const app = initializeApp(config)
export const analytics = getAnalytics(app);
export const db = getDatabase();


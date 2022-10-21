import {Level} from "../DataTypes";


export type AnyHistory = (SinglePlayerHistory | QuickPlayHistory | MultiplayerHistory);

export type QuickPlayHistory = {
    mode: "quick";
    date: number;
    opponent: string;
    questionsData: QuestionHistory[];
    result: Result;
    level: Level;
}

export type MultiplayerHistory = {
    mode: "multi";
    date: number;
    players: string[];
    level: Level;
    times: {name: string, time: number}[];
    numberOfQuestions: number;
}

export type SinglePlayerHistory = {
    mode: "single";
    date: number;
    questionsData: string[];
    level: Level;
    questions: string[];
    timePerQuestion: number;
    record: boolean;
}

export type QuestionHistory = {
    name: string;
    result: Result;
}

export type Result = -1 | 0 | 1;

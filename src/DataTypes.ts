
export type QuestionData = {
    description: string;
    example: { input: string[], output: string };
    level: Level;
    params: string;
    return: string;
    subject: string;
    time: number;
    languages: Language[];
    hasSolution: Language[];
}

export type Level = "easy" | "medium" | "hard" | "";

export type ExamData = {
    name: string;
    description: string;
    duration: string;
    passingScore: string;
    finishNote: string;
    questions: LiteQuestionData[];
    languages: Language[];
    createdDate: number;
}

export type LiteQuestionData = {
    name: string;
    description: string;
    level: Level;
}

export type QuickPlayGameData = {
    opponent: UserData;
    questions: string[];
    error?: "canceled";
    gameCode: string;
    level: Level;
}

export enum Bonus {
    perfectMatch = "perfectMatch",
    significantAdvantage = "significantAdvantage",
    closeMatch = "closeMatch",
    fasterThan70Percent = "fasterThan70Percent",
}

export type QuickPlayGameFinished = {
    coins: number;
    bonuses: {
        name: Bonus;
        amount: number;
    }[];
}

export type Player = {
    admin: boolean;
    currentQuestion: number;
    image: string;
    score: number;
    time: number;
}

export type PlayersData = {
    [name: string]: Player;
}

export type UserData = {
    name: string;
    coins: number;
    wins: number;
    losses: number;
    draws: number;
    points: number;
    countryCode: string;
    easyRecord: number;
    mediumRecord: number;
    hardRecord: number;
    image: string;
    displayName: string;
    likes: string[];
}

export type Solutions = {
    [question: string]: {
        java: string;
        javascript: string;
        python: string;
        kotlin: string;
    }
}

export type PracticeQuestionItem = {
    name: string;
    subject: string;
}

export type PracticeQuestionList = {
    Easy: PracticeQuestionItem[],
    Medium: PracticeQuestionItem[],
    Hard: PracticeQuestionItem[]
}

export type QuestionList = string[];



export type Language = "python" | "javascript" | "java" | "kotlin" | "c#";

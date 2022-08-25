
export type QuestionData = {
    description: string;
    example: { input: string[], output: string };
    level: string;
    params: string;
    return: string;
    subject: string;
    time: number;
    languages: Language[];
}

export type QuickPlayGameData = {
    opponent: UserData;
    questions: string[];
    error?: "canceled";
    gameCode: string;
}

export type Player = {
    admin: boolean;
    currentQuestion: number;
    image: string;
    score: number
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


export type Language = "python" | "javascript" | "java" | "kotlin";

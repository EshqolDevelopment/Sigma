
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
    opponentName: string,
    questions: string[],
    error?: "canceled",
    gameCode: string,
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


export type Language = "python" | "javascript" | "java" | "kotlin";

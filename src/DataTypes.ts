
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

export type SinglePlayerGameData = {
    opponent: string,
    questions: string[],
    error?: "canceled",
}

export type Language = "python" | "javascript" | "java" | "kotlin";

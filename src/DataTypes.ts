
export type QuestionData = {
    description: string;
    example: { input: string, output: string };
    level: string;
    params: string;
    return: string;
    subject: string;
    time: number;
}

export type Language = "python" | "javascript" | "java" | "kotlin";

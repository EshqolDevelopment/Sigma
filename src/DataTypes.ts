
export type QuestionData = {
    description: string;
    example: string;
    level: string;
    params: {[argName: string]: string};
    return: string;
    subject: string;
    time: number;
}

export type Language = "python" | "javascript" | "java" | "kotlin";

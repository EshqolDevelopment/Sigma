
export type Solver = {
    name: string;
    score: number;
    timeTaken: number;
}

export type ExamData = {
    name: string;
    createdDate: string;
    averageScore: number;
    solvers: Solver[];
    id: string;
}

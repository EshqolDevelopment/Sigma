import {Language} from "../DataTypes";

export type Solver = {
    name: string;
    score: number;
    timeTaken: number;
}

export type ExamListItem = {
    name: string;
    createdDate: string;
    averageScore: number;
    solvers: Solver[];
    id: string;
}

export type ExamData = {
    name: string;
    description: string;
    duration: string;
    passingScore: string;
    finishNote: string;
    questions: string[];
    languages: Language[];
    createdDate: number;
}

export type ExamExplorerData = {
    name: string;
    description: string;
    languages: Language[];
    commits: number;
    stars: number;
}
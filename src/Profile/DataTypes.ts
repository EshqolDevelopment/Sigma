

export type GraphsData = {
    winRate: { [date: string]: number };
    gamesResultsDistribution: { wins: number, losses: number, draws: number };
    levelDistribution: { [level: string]: number };
    coinsOverTime: { [date: string]: number };
}

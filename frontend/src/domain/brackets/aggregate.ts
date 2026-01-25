interface AggregateScores {
    score: number;
    remainingScore: number;
    maxPossibleScore: number;
}

type AggregateScoresKey = keyof AggregateScores;

interface AggregateChallenger {
    displayName: string;
    scores: AggregateScores;
}

export { AggregateChallenger, AggregateScores, AggregateScoresKey };

interface ChallengeRoundScore {
    score: number;
    possiblePointsMax: number;
}

interface ChallengeScoreByPeriod {
    [round: string]: ChallengeRoundScore;
}

interface ChallengeMember {
    id: string;
}

interface ChallengeScore {
    scoreByPeriod: ChallengeScoreByPeriod;
}

interface ChallengeEntry {
    member: ChallengeMember;
    score: ChallengeScore;
}

interface ChallengeGroup {
    entries: ChallengeEntry[];
}

export { ChallengeGroup, ChallengeEntry, ChallengeScoreByPeriod, ChallengeRoundScore };

import { RoundScore } from './round-score.js';

interface ChallengeScoreByPeriod {
    round: RoundScore;
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

export { ChallengeGroup, ChallengeEntry, ChallengeScoreByPeriod };

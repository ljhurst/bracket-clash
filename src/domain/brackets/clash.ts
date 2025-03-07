import { RoundScore } from './round-score.js';

interface ClashBracket {
    gender: string;
    rounds: RoundScore[];
}

interface ClashChallenger {
    displayName: string;
    brackets: ClashBracket[];
}

interface ClashData {
    challengers: ClashChallenger[];
}

export { ClashData, ClashBracket };

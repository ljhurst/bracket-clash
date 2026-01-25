interface ClashRoundScore {
    round: string;
    score: number;
    possiblePointsMax: number;
}

interface ClashBracket {
    gender: string;
    rounds: ClashRoundScore[];
}

interface ClashChallenger {
    displayName: string;
    brackets: ClashBracket[];
}

interface ClashData {
    challengers: ClashChallenger[];
}

export { ClashData, ClashBracket, ClashRoundScore };

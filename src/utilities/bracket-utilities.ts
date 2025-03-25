import { AggregateScores } from '../domain/brackets/aggregate';
import { ClashBracket } from '../domain/brackets/clash';

function filterBracketsByGender(brackets: ClashBracket[], gender: string): ClashBracket[] {
    return brackets.filter((bracket) => bracket.gender === gender);
}

function sumBracketScores(brackets: ClashBracket[]): AggregateScores {
    return brackets
        .map(sumRounds)
        .reduce(combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 });
}

function sumRounds(bracket: ClashBracket): AggregateScores {
    return {
        score: bracket.rounds.reduce((acc, round) => acc + round.score, 0),
        remainingScore: bracket.rounds.reduce(
            (acc, round) => acc + round.possiblePointsMax - round.score,
            0,
        ),
        maxPossibleScore: bracket.rounds.reduce((acc, round) => acc + round.possiblePointsMax, 0),
    };
}

function combineBrackets(acc: AggregateScores, bracket: AggregateScores): AggregateScores {
    return {
        score: acc.score + bracket.score,
        remainingScore: acc.remainingScore + bracket.remainingScore,
        maxPossibleScore: acc.maxPossibleScore + bracket.maxPossibleScore,
    };
}

export { filterBracketsByGender, sumBracketScores };

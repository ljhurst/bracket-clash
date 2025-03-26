import { AggregateScores } from '../domain/brackets/aggregate';
import { ClashBracket } from '../domain/brackets/clash';

function filterBracketsByGender(brackets: ClashBracket[], gender: string): ClashBracket[] {
    return brackets.filter((bracket) => bracket.gender === gender);
}

function sumBracketScores(brackets: ClashBracket[]): AggregateScores {
    return brackets
        .map(_sumRounds)
        .reduce(_combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 });
}

export { filterBracketsByGender, sumBracketScores };

function _sumRounds(bracket: ClashBracket): AggregateScores {
    return {
        score: bracket.rounds.reduce((acc, round) => acc + round.score, 0),
        remainingScore: bracket.rounds.reduce(
            (acc, round) => acc + round.possiblePointsMax - round.score,
            0,
        ),
        maxPossibleScore: bracket.rounds.reduce((acc, round) => acc + round.possiblePointsMax, 0),
    };
}

function _combineBrackets(acc: AggregateScores, bracket: AggregateScores): AggregateScores {
    return {
        score: acc.score + bracket.score,
        remainingScore: acc.remainingScore + bracket.remainingScore,
        maxPossibleScore: acc.maxPossibleScore + bracket.maxPossibleScore,
    };
}

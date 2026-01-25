import {
    AggregateChallenger,
    AggregateScores,
    AggregateScoresKey,
} from '../domain/brackets/aggregate';
import { ClashData, ClashBracket } from '../domain/brackets/clash';

function filterData(data: ClashData, filterByTournamentValue: string): ClashData {
    console.log('filterByTournamentValue', filterByTournamentValue);
    if (filterByTournamentValue === 'all') {
        return data;
    }

    return {
        challengers: data.challengers.map((challenger) => {
            return {
                displayName: challenger.displayName,
                brackets: filterBracketsByGender(challenger.brackets, filterByTournamentValue),
            };
        }),
    };
}

function filterBracketsByGender(brackets: ClashBracket[], gender: string): ClashBracket[] {
    return brackets.filter((bracket) => bracket.gender === gender);
}

function sumScores(data: ClashData): AggregateChallenger[] {
    return data.challengers.map((challenger) => {
        return {
            displayName: challenger.displayName,
            scores: sumBracketScores(challenger.brackets),
        };
    });
}

function sumBracketScores(brackets: ClashBracket[]): AggregateScores {
    return brackets
        .map(_sumRounds)
        .reduce(_combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 });
}

function sortData(data: AggregateChallenger[], sortByValue: string): AggregateChallenger[] {
    console.log('sortByValue', sortByValue);
    return data
        .sort((a, b) => {
            return (
                a.scores[sortByValue as AggregateScoresKey] -
                b.scores[sortByValue as AggregateScoresKey]
            );
        })
        .reverse();
}

export { filterData, filterBracketsByGender, sumScores, sumBracketScores, sortData };

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

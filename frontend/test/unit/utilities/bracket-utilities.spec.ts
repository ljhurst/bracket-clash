import { AggregateChallenger } from '../../../src/domain/brackets/aggregate';
import { ClashData, ClashBracket } from '../../../src/domain/brackets/clash';
import {
    filterData,
    filterBracketsByGender,
    sumScores,
    sumBracketScores,
    sortData,
} from '../../../src/utilities/bracket-utilities';

describe('bracket-utilities', () => {
    describe('filterData', () => {
        it('returns all data when filterByTournamentValue is "all"', () => {
            const data = {
                challengers: [
                    {
                        displayName: 'Challenger 1',
                        brackets: [],
                    },
                ],
            };

            const result = filterData(data, 'all');

            expect(result).toEqual(data);
        });

        it('filters brackets by tournament when filterByTournamentValue is not "all"', () => {
            const keep: ClashBracket = {
                gender: 'a',
                rounds: [
                    {
                        round: '1',
                        score: 1,
                        possiblePointsMax: 2,
                    },
                ],
            };

            const discard: ClashBracket = {
                gender: 'b',
                rounds: [
                    {
                        round: '1',
                        score: 1,
                        possiblePointsMax: 2,
                    },
                ],
            };

            const data = {
                challengers: [
                    {
                        displayName: 'Challenger 1',
                        brackets: [keep, discard],
                    },
                ],
            };

            const result = filterData(data, 'a');

            expect(result.challengers[0].brackets).toEqual([keep]);
        });
    });

    describe('filterBracketsByGender', () => {
        it('keeps brackets that match the given gender', () => {
            const keep: ClashBracket = {
                gender: 'a',
                rounds: [
                    {
                        round: '1',
                        score: 1,
                        possiblePointsMax: 2,
                    },
                ],
            };

            const discard: ClashBracket = {
                gender: 'b',
                rounds: [
                    {
                        round: '1',
                        score: 1,
                        possiblePointsMax: 2,
                    },
                ],
            };

            const brackets = [keep, discard];

            const result = filterBracketsByGender(brackets, 'a');

            expect(result).toEqual([keep]);
        });
    });

    describe('sumScores', () => {
        it('sums the scores of all brackets for each challenger', () => {
            const clashData: ClashData = {
                challengers: [
                    {
                        displayName: 'Challenger 1',
                        brackets: [
                            {
                                gender: 'a',
                                rounds: [
                                    {
                                        round: '1',
                                        score: 1,
                                        possiblePointsMax: 2,
                                    },
                                ],
                            },
                            {
                                gender: 'b',
                                rounds: [
                                    {
                                        round: '1',
                                        score: 2,
                                        possiblePointsMax: 3,
                                    },
                                ],
                            },
                        ],
                    },
                ],
            };

            const result = sumScores(clashData);

            const expected = [
                {
                    displayName: 'Challenger 1',
                    scores: {
                        score: 3,
                        remainingScore: 2,
                        maxPossibleScore: 5,
                    },
                },
            ];

            expect(result).toEqual(expected);
        });
    });

    describe('sumBracketScores', () => {
        it('sums the scores of all rounds in all brackets', () => {
            const bracket1: ClashBracket = {
                gender: 'a',
                rounds: [
                    {
                        round: '1',
                        score: 1,
                        possiblePointsMax: 2,
                    },
                    {
                        round: '2',
                        score: 3,
                        possiblePointsMax: 4,
                    },
                ],
            };

            const bracket2: ClashBracket = {
                gender: 'b',
                rounds: [
                    {
                        round: '1',
                        score: 2,
                        possiblePointsMax: 3,
                    },
                ],
            };

            const brackets = [bracket1, bracket2];

            const result = sumBracketScores(brackets);

            const expected = {
                score: 6,
                remainingScore: 3,
                maxPossibleScore: 9,
            };

            expect(result).toEqual(expected);
        });
    });

    describe('sortData', () => {
        it('sorts data by the specified key in descending order', () => {
            const higherScore: AggregateChallenger = {
                displayName: 'Challenger 2',
                scores: {
                    score: 3,
                    remainingScore: 2,
                    maxPossibleScore: 5,
                },
            };

            const lowerScore: AggregateChallenger = {
                displayName: 'Challenger 1',
                scores: {
                    score: 2,
                    remainingScore: 3,
                    maxPossibleScore: 5,
                },
            };

            const data = [lowerScore, higherScore];

            const result = sortData(data, 'score');

            expect(result).toEqual([higherScore, lowerScore]);
        });
    });
});

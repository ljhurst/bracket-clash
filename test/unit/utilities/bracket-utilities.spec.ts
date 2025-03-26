import { ClashBracket } from '../../../src/domain/brackets/clash';
import { filterBracketsByGender, sumBracketScores } from '../../../src/utilities/bracket-utilities';

describe('bracket-utilities', () => {
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
});

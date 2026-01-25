import { getSelectValues, getChangeableElements } from '../../../src/utilities/dom-utilities';

describe('dom-utilities', () => {
    beforeEach(() => {
        document.body.innerHTML = `
            <select id="select-year">
                <option value="2023">2023</option>
                <option value="2022">2022</option>
            </select>
            <select id="select-tournament">
                <option value="all">All</option>
                <option value="tournament1">Tournament 1</option>
            </select>
            <select id="select-sort-by">
                <option value="score">Score</option>
                <option value="name">Name</option>
            </select>
            <div id="scores-table"></div>
        `;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    describe('getSelectValues', () => {
        it('returns the correct values from the select elements', () => {
            const result = getSelectValues();

            expect(result.filterByYearValue).toBe('2023');
            expect(result.filterByTournamentValue).toBe('all');
            expect(result.sortByValue).toBe('score');
        });
    });

    describe('getChangeableElements', () => {
        it('returns the correct select elements', () => {
            const result = getChangeableElements();

            expect(result.selectYear.id).toBe('select-year');
            expect(result.selectTournament.id).toBe('select-tournament');
            expect(result.selectSortBy.id).toBe('select-sort-by');
        });
    });
});

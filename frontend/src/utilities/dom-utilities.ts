import { FilterValues } from '../domain/filter-values';

function getSelectValues(): FilterValues {
    const { selectYear, selectTournament, selectSortBy } = getChangeableElements();

    return {
        filterByYearValue: selectYear.value,
        filterByTournamentValue: selectTournament.value,
        sortByValue: selectSortBy.value,
    };
}

function getChangeableElements(): Record<string, HTMLSelectElement> {
    return {
        selectYear: _getSelectElement('select-year'),
        selectTournament: _getSelectElement('select-tournament'),
        selectSortBy: _getSelectElement('select-sort-by'),
    };
}

export { getSelectValues, getChangeableElements };

function _getSelectElement(id: string): HTMLSelectElement {
    return document.getElementById(id) as HTMLSelectElement;
}

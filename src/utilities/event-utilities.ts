import { Events } from '../domain/events';
import { ChartState } from '../state/chart-state';
import { DataState } from '../state/data-state';
import { TableState } from '../state/table-state';
import { getChangeableElements, getSelectValues } from '../utilities/dom-utilities';
import { reRender } from '../utilities/render-utilities';

function setFilterByYearChangeHandler(
    dataState: DataState,
    chartState: ChartState,
    tableState: TableState,
): void {
    const { selectYear } = getChangeableElements();
    selectYear.addEventListener(Events.CHANGE, () => {
        console.log(`${selectYear.id} ${Events.CHANGE}`, selectYear.value);
        dataState
            .updateData(selectYear.value)
            .then(() => {
                const filterValues = getSelectValues();
                reRender(dataState, filterValues, chartState, tableState);
            })
            .catch((error) => {
                console.error('Error in setFilterByYearChangeHandler', error);
            });
    });
}

function setFilterByTournamentChangeHandler(dataState: DataState, chartState: ChartState): void {
    const { selectTournament } = getChangeableElements();
    selectTournament.addEventListener(Events.CHANGE, () => {
        console.log(`${selectTournament.id} ${Events.CHANGE}`, selectTournament.value);
        const filterValues = getSelectValues();
        reRender(dataState, filterValues, chartState);
    });
}

function setSortByChangeHandler(dataState: DataState, chartState: ChartState): void {
    const { selectSortBy } = getChangeableElements();
    selectSortBy.addEventListener(Events.CHANGE, () => {
        console.log(`${selectSortBy.id} ${Events.CHANGE}`, selectSortBy.value);
        const filterValues = getSelectValues();
        reRender(dataState, filterValues, chartState);
    });
}

export { setFilterByYearChangeHandler, setFilterByTournamentChangeHandler, setSortByChangeHandler };

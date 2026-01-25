import { ChartState } from './state/chart-state';
import { DataState } from './state/data-state';
import { TableState } from './state/table-state';
import { getSelectValues } from './utilities/dom-utilities';
import {
    setFilterByYearChangeHandler,
    setFilterByTournamentChangeHandler,
    setSortByChangeHandler,
} from './utilities/event-utilities';

async function main(): Promise<void> {
    const dataState = new DataState();

    const filterValues = getSelectValues();

    await dataState.updateData(filterValues.filterByYearValue);

    const chartState: ChartState = new ChartState(dataState.getData(), filterValues);
    const tableState: TableState = new TableState(dataState.getData());

    setFilterByYearChangeHandler(dataState, chartState, tableState);
    setFilterByTournamentChangeHandler(dataState, chartState);
    setSortByChangeHandler(dataState, chartState);
}

export { main };

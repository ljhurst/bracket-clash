import { FilterValues } from '../domain/filter-values';
import { ChartState } from '../state/chart-state';
import { DataState } from '../state/data-state';
import { TableState } from '../state/table-state';

function reRender(
    dataState: DataState,
    filterData: FilterValues,
    chartState: ChartState,
    tableState: TableState | null = null,
): void {
    const data = dataState.getData();

    if (!data) {
        return;
    }

    chartState.updateData(data, filterData);

    if (tableState) {
        tableState.updateData(data);
    }
}

export { reRender };

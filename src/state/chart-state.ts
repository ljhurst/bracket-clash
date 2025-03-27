import { Chart } from 'chart.js/auto';

import { AggregateChallenger } from '../domain/brackets/aggregate';
import { ClashData } from '../domain/brackets/clash';
import { ChartDataSet } from '../domain/chart-data';
import { FilterValues } from '../domain/filter-values';
import { filterData, sumScores, sortData } from '../utilities/bracket-utilities';

Chart.defaults.color = 'white';

const DATASET_COLORS = {
    score: {
        background: 'rgb(34, 139, 34, 0.2)',
        border: 'rgb(34, 139, 34, 1.0)',
    },
    remainingScore: {
        background: 'rgb(144, 238, 144, 0.2)',
        border: 'rgb(144, 238, 144, 1.0)',
    },
};

class ChartState {
    private chart;

    constructor(clashData: ClashData | null, filterValues: FilterValues) {
        if (!clashData) {
            throw new Error('Clash data is null');
        }

        this.chart = this.renderChart(clashData, filterValues);
    }

    public updateData(clashData: ClashData, filterValues: FilterValues): void {
        this.chart.destroy();
        this.chart = this.renderChart(clashData, filterValues);
    }

    private renderChart(clashData: ClashData, filterValues: FilterValues): Chart {
        const { labels, datasets } = this.processData(clashData, filterValues);
        return this.createChart(labels, datasets);
    }

    private processData(data: ClashData, filterValues: FilterValues) {
        const { filterByTournamentValue, sortByValue } = filterValues;

        const filteredData = filterData(data, filterByTournamentValue);
        console.log('filteredData', filteredData);

        const summedData = sumScores(filteredData);
        console.log('summedData', summedData);

        const sortedData = sortData(summedData, sortByValue);
        console.log('sortedData', sortedData);

        const chartData = this.prepareChartData(sortedData);

        return chartData;
    }

    private prepareChartData(sortedData: AggregateChallenger[]) {
        const labels = sortedData.map((challenger) => challenger.displayName);
        const datasets = [
            {
                label: 'Score',
                data: sortedData.map((challenger) => challenger.scores.score),
                backgroundColor: DATASET_COLORS.score.background,
                borderColor: DATASET_COLORS.score.border,
                borderWidth: 1,
            },
            {
                label: 'Remaining Score',
                data: sortedData.map((challenger) => challenger.scores.remainingScore),
                backgroundColor: DATASET_COLORS.remainingScore.background,
                borderColor: DATASET_COLORS.remainingScore.border,
                borderWidth: 1,
            },
        ];

        return { labels, datasets };
    }

    private createChart(labels: string[], datasets: ChartDataSet[]) {
        console.log('labels', labels);
        console.log('datasets', datasets);

        const ctx = document.getElementById('scores-chart') as HTMLCanvasElement;

        return new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: datasets,
            },
            options: {
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        beginAtZero: true,
                        stacked: true,
                    },
                },
            },
        });
    }
}

export { ChartState };

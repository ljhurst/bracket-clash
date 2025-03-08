import {
    AggregateChallenger,
    AggregateScores,
    AggregateScoresKey,
} from './domain/brackets/aggregate.js';
import { ClashBracket, ClashData } from './domain/brackets/clash.js';
import { ChartDataSet } from './domain/chart-data.js';
import { Events } from './domain/events.js';
import { DataState } from './state/data-state.js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const Chart: any;

(function () {
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    Chart.defaults.color = 'white';

    let CHART: Chart | null = null;

    main().catch((error) => {
        console.error('Error in main', error);
    });

    async function main(): Promise<void> {
        const dataState = new DataState();

        const { filterByYearValue } = getSelectValues();

        await dataState.updateData(filterByYearValue);

        setFilterByYearChangeHandler(dataState);
        setFilterByTournamentChangeHandler(dataState);
        setSortByChangeHandler(dataState);

        render(dataState.getData());
    }

    function setFilterByYearChangeHandler(dataState: DataState): void {
        const { selectYear } = getChangeableElements();
        selectYear.addEventListener(Events.CHANGE, () => {
            console.log(`${selectYear.id} ${Events.CHANGE}`, selectYear.value);
            dataState
                .updateData(selectYear.value)
                .then(() => {
                    render(dataState.getData());
                })
                .catch((error) => {
                    console.error('Error in setFilterByYearChangeHandler', error);
                });
        });
    }

    function setFilterByTournamentChangeHandler(dataState: DataState): void {
        const { selectTournament } = getChangeableElements();
        selectTournament.addEventListener(Events.CHANGE, () => {
            console.log(`${selectTournament.id} ${Events.CHANGE}`, selectTournament.value);
            render(dataState.getData());
        });
    }

    function setSortByChangeHandler(dataState: DataState): void {
        const { selectSortBy } = getChangeableElements();
        selectSortBy.addEventListener(Events.CHANGE, () => {
            console.log(`${selectSortBy.id} ${Events.CHANGE}`, selectSortBy.value);
            render(dataState.getData());
        });
    }

    function render(data: ClashData | null): void {
        if (!data) {
            return;
        }

        const { filterByTournamentValue, sortByValue } = getSelectValues();

        const filteredData = filterData(data, filterByTournamentValue);
        console.log('filteredData', filteredData);

        const summedData = sumScores(filteredData);
        console.log('summedData', summedData);

        const sortedData = sortData(summedData, sortByValue);
        console.log('sortedData', sortedData);

        const { labels, datasets } = prepareChartData(sortedData);
        renderChart(labels, datasets);
    }

    function getChangeableElements(): Record<string, HTMLSelectElement> {
        return {
            selectYear: getSelectElement('select-year'),
            selectTournament: getSelectElement('select-tournament'),
            selectSortBy: getSelectElement('select-sort-by'),
        };
    }

    function getSelectElement(id: string): HTMLSelectElement {
        return document.getElementById(id) as HTMLSelectElement;
    }

    function getSelectValues(): Record<string, string> {
        const { selectYear, selectTournament, selectSortBy } = getChangeableElements();

        return {
            filterByYearValue: selectYear.value,
            filterByTournamentValue: selectTournament.value,
            sortByValue: selectSortBy.value,
        };
    }

    function filterData(data: ClashData, filterByTournamentValue: string): ClashData {
        console.log('filterByTournamentValue', filterByTournamentValue);
        if (filterByTournamentValue === 'all') {
            return data;
        }

        return {
            challengers: data.challengers.map((challenger) => {
                return {
                    displayName: challenger.displayName,
                    brackets: challenger.brackets.filter(
                        (bracket) => bracket.gender === filterByTournamentValue,
                    ),
                };
            }),
        };
    }

    function sumScores(data: ClashData): AggregateChallenger[] {
        return data.challengers.map((challenger) => {
            return {
                displayName: challenger.displayName,
                scores: challenger.brackets
                    .map(sumRounds)
                    .reduce(combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 }),
            };
        });
    }

    function sumRounds(bracket: ClashBracket): AggregateScores {
        return {
            score: bracket.rounds.reduce((acc, round) => acc + round.score, 0),
            remainingScore: bracket.rounds.reduce(
                (acc, round) => acc + round.possiblePointsMax - round.score,
                0,
            ),
            maxPossibleScore: bracket.rounds.reduce(
                (acc, round) => acc + round.possiblePointsMax,
                0,
            ),
        };
    }

    function combineBrackets(acc: AggregateScores, bracket: AggregateScores): AggregateScores {
        return {
            score: acc.score + bracket.score,
            remainingScore: acc.remainingScore + bracket.remainingScore,
            maxPossibleScore: acc.maxPossibleScore + bracket.maxPossibleScore,
        };
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

    function prepareChartData(sortedData: AggregateChallenger[]) {
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

    function renderChart(labels: string[], datasets: ChartDataSet[]): void {
        console.log('labels', labels);
        console.log('datasets', datasets);

        const ctx = document.getElementById('scores-chart') as HTMLCanvasElement;

        if (CHART) {
            CHART.destroy();
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
        CHART = new Chart(ctx, {
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
})();

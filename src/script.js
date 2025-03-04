/* globals Chart */
import { fetchData } from './integrations/fetch-data.js';
import { Events } from './domain/events.js';

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

    Chart.defaults.color = 'white';

    let CHART = null;

    main();

    async function main() {
        const { filterByYearValue } = getSelectValues();

        const data = await fetchData(filterByYearValue);
        console.log('data', data);

        setFilterByYearChangeHandler();
        setFilterByTournamentChangeHandler(data);
        setSortByChangeHandler(data);

        render(data);
    }

    function setFilterByYearChangeHandler() {
        const { selectYear } = getChangeableElements();
        selectYear.addEventListener(Events.CHANGE, async () => {
            console.log(`${selectYear.id} ${Events.CHANGE}`, selectYear.value);
            const data = await fetchData(selectYear.value);
            render(data);
        });
    }

    function setFilterByTournamentChangeHandler(data) {
        const { selectTournament } = getChangeableElements();
        selectTournament.addEventListener(Events.CHANGE, () => {
            console.log(`${selectTournament.id} ${Events.CHANGE}`, selectTournament.value);
            render(data);
        });
    }

    function setSortByChangeHandler(data) {
        const { selectSortBy } = getChangeableElements();
        selectSortBy.addEventListener(Events.CHANGE, () => {
            console.log(`${selectSortBy.id} ${Events.CHANGE}`, selectSortBy.value);
            render(data);
        });
    }

    function render(data) {
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

    function getChangeableElements() {
        return {
            selectYear: document.getElementById('select-year'),
            selectTournament: document.getElementById('select-tournament'),
            selectSortBy: document.getElementById('select-sort-by'),
        };
    }

    function getSelectValues() {
        const { selectYear, selectTournament, selectSortBy } = getChangeableElements();

        return {
            filterByYearValue: selectYear.value,
            filterByTournamentValue: selectTournament.value,
            sortByValue: selectSortBy.value,
        };
    }

    function filterData(data, filterByTournamentValue) {
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

    function sumScores(data) {
        return data.challengers.map((challenger) => {
            return {
                displayName: challenger.displayName,
                scores: challenger.brackets
                    .map(sumRounds)
                    .reduce(combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 }),
            };
        });
    }

    function sumRounds(bracket) {
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

    function combineBrackets(acc, bracket) {
        return {
            score: acc.score + bracket.score,
            remainingScore: acc.remainingScore + bracket.remainingScore,
            maxPossibleScore: acc.maxPossibleScore + bracket.maxPossibleScore,
        };
    }

    function sortData(data, sortByValue) {
        console.log('sortByValue', sortByValue);
        return data
            .sort((a, b) => {
                return a.scores[sortByValue] - b.scores[sortByValue];
            })
            .reverse();
    }

    function prepareChartData(sortedData) {
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

    function renderChart(labels, datasets) {
        console.log('labels', labels);
        console.log('datasets', datasets);

        const ctx = document.getElementById('scores-chart');

        if (CHART) {
            CHART.destroy();
        }

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

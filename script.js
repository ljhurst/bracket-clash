/* globals Chart */
import { fetchData } from './fetch-data.js';

(function () {
    let CHART = null;

    main();

    async function main() {
        const data = await fetchData();
        console.log('data', data);

        setFilterByTournamentChangeHandler(data);
        setSortByChangeHandler(data);

        render(data);
    }

    function setFilterByTournamentChangeHandler(data) {
        const selectTournament = document.getElementById('select-tournament');
        selectTournament.addEventListener('change', () => {
            console.log('select-tournament change', selectTournament.value);
            render(data);
        });
    }

    function setSortByChangeHandler(data) {
        const selectSortBy = document.getElementById('select-sort-by');
        selectSortBy.addEventListener('change', () => {
            console.log('select-sort-by change', selectSortBy.value);
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

    function getSelectValues() {
        const selectTournament = document.getElementById('select-tournament');
        const selectSortBy = document.getElementById('select-sort-by');

        return {
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
                    brackets: challenger.brackets.filter((bracket) => bracket.gender === filterByTournamentValue),
                };
            })
        };
    }

    function sumScores(data) {
        return data.challengers.map((challenger) => {
            return {
                displayName: challenger.displayName,
                scores: challenger.brackets.map(sumRounds).reduce(combineBrackets, { score: 0, remainingScore: 0, maxPossibleScore: 0 }),
            };
        });
    }

    function sumRounds(bracket) {
        return {
            score: bracket.rounds.reduce((acc, round) => acc + round.score, 0),
            remainingScore: bracket.rounds.reduce((acc, round) => acc + round.possiblePointsMax - round.score, 0),
            maxPossibleScore: bracket.rounds.reduce((acc, round) => acc + round.possiblePointsMax, 0),
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
        return data.sort((a, b) => {
            return a.scores[sortByValue] - b.scores[sortByValue];
        }).reverse();
    }

    function prepareChartData(sortedData) {
        const labels = sortedData.map((challenger) => challenger.displayName);
        const datasets = [
            {
                label: 'Score',
                data: sortedData.map((challenger) => challenger.scores.score),
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
            },
            {
                label: 'Remaining Score',
                data: sortedData.map((challenger) => challenger.scores.remainingScore),
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
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
                    }
                }
            }
        });
    }
})();

import DataTable from 'datatables.net';

import { ClashData } from '../domain/brackets/clash';
import { Gender } from '../domain/genders';
import { filterBracketsByGender, sumBracketScores } from '../utilities/bracket-utilities';

class TableState {
    private table;

    constructor(clashData: ClashData | null) {
        if (!clashData) {
            throw new Error('Clash data is null');
        }

        const dataSet = this.prepareDataSet(clashData);
        this.table = this.createTable(dataSet);
    }

    public updateData(data: ClashData): void {
        const dataSet = this.prepareDataSet(data);

        this.table.clear();
        this.table.rows.add(dataSet);
        this.table.draw();
    }

    private createTable(dataSet: string[][]) {
        return new DataTable('#scores-table', {
            columns: [
                { title: 'Challenger' },
                { title: "Men's Score" },
                { title: "Women's Score" },
                { title: 'Total Score' },
                { title: 'Max Possible Score' },
            ],
            data: dataSet,
            lengthChange: false,
            order: [[3, 'desc']],
            pageLength: dataSet.length,
            searching: false,
        });
    }

    private prepareDataSet(data: ClashData): string[][] {
        return data.challengers.map((challenger) => {
            const mensBrackets = filterBracketsByGender(challenger.brackets, Gender.MENS);
            const mensScore = sumBracketScores(mensBrackets);

            const womensBrackets = filterBracketsByGender(challenger.brackets, Gender.WOMENS);
            const womensScore = sumBracketScores(womensBrackets);

            const totalScore = sumBracketScores(challenger.brackets);

            return [
                challenger.displayName,
                mensScore.score,
                womensScore.score,
                totalScore.score,
                totalScore.maxPossibleScore,
            ] as string[];
        });
    }
}

export { TableState };

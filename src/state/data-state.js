import { fetchData } from '../integrations/fetch-data.js';

class DataState {
    constructor() {
        this.data = null;
    }

    async updateData(year) {
        this.data = await fetchData(year);
        console.log('data', this.data);

        return this.data;
    }

    getData() {
        return this.data;
    }
}

export { DataState };

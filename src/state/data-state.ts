import { ClashData } from '../domain/brackets/clash.js';
import { fetchData } from '../integrations/fetch-data.js';

class DataState {
    private data: ClashData | null = null;

    async updateData(year: string): Promise<void> {
        this.data = await fetchData(year);
        console.log('data', this.data);
    }

    getData(): ClashData | null {
        return this.data;
    }
}

export { DataState };

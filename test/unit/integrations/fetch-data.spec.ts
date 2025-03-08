import { jest } from '@jest/globals';

import { fetchData } from '../../../src/integrations/fetch-data.js';

type MockFetch = jest.MockedFunction<typeof fetch>;

describe('fetchData', () => {
    beforeEach(() => {
        global.fetch = jest.fn() as MockFetch;
    });

    afterEach(() => {
        jest.resetAllMocks();
    });

    it('fetches data successfully', async () => {
        const mockYear = '2021';
        const mockData = Promise.resolve({
            entries: [
                {
                    member: {
                        id: '{E00185BE-993E-425F-8185-BE993E625F84}',
                    },
                    score: {
                        scoreByPeriod: {
                            1: {
                                score: 1,
                                possiblePointsMax: 2,
                            },
                        },
                    },
                },
            ],
        });

        const mockFetch = global.fetch as MockFetch;
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockData,
            } as Response);

        const result = await fetchData(mockYear);

        const expectedFetchedData = {
            challengers: [
                {
                    displayName: 'Luke',
                    brackets: [
                        {
                            gender: 'mens',
                            rounds: [
                                {
                                    round: '1',
                                    score: 1,
                                    possiblePointsMax: 2,
                                },
                            ],
                        },
                        {
                            gender: 'womens',
                            rounds: [
                                {
                                    round: '1',
                                    score: 1,
                                    possiblePointsMax: 2,
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        expect(result).toEqual(expectedFetchedData);
        expect(fetch).toHaveBeenCalledTimes(2);
    });
});

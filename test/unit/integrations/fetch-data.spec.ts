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
        const memberId = '{E00185BE-993E-425F-8185-BE993E625F84}';
        const mockYear = '2021';
        const mockManifest = Promise.resolve({
            womens: {
                [mockYear]: true,
            },
        });
        const mockWomensOverride = Promise.resolve({
            entries: [
                {
                    member: {
                        id: memberId,
                    },
                    score: {
                        scoreByPeriod: {
                            1: {
                                score: 10,
                                possiblePointsMax: 20,
                            },
                        },
                    },
                },
            ],
        });
        const mockMensData = Promise.resolve({
            entries: [
                {
                    member: {
                        id: memberId,
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
        const mockWomensData = Promise.resolve({
            entries: [
                {
                    member: {
                        id: memberId,
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
                json: async () => mockMensData,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockWomensData,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockManifest,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockManifest,
            } as Response)
            .mockResolvedValueOnce({
                ok: true,
                json: async () => mockWomensOverride,
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
                                    score: 10,
                                    possiblePointsMax: 20,
                                },
                            ],
                        },
                    ],
                },
            ],
        };

        expect(result).toEqual(expectedFetchedData);
        expect(fetch).toHaveBeenCalledTimes(5);
    });
});

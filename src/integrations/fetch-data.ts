import {
    ChallengeEntry,
    ChallengeGroup,
    ChallengeRoundScore,
    ChallengeScoreByPeriod,
} from '../domain/brackets/api-schema.js';
import { ClashData, ClashBracket, ClashRoundScore } from '../domain/brackets/clash.js';
import { OverrideManifest } from '../domain/override/override-manifest.js';

type MemberToBracket = Record<string, ClashBracket>;
type MemberToBrackets = Record<string, ClashBracket[]>;
type GroupBrackets = MemberToBracket[];

const ESPN_ID_MAP: Record<string, string> = {
    '{E00185BE-993E-425F-8185-BE993E625F84}': 'Luke',
    '{ABBA3098-00E7-4D1B-8ED0-0CF6E3D6CDC9}': 'Pete',
    '{CA11938A-A78D-4D6C-9227-1E4C19D8D0DA}': 'Emma S.',
    '{82BF5DF7-2F8E-47F7-9163-1F845FA2BD51}': 'Aaron',
    '{33B36EDF-89AF-4484-8878-FA2BB838FD4B}': 'Katy',
    '{A96363C0-81E1-4903-A58C-3A2740CC8B88}': 'Emma V.',
    '{36B40A82-310D-423A-9642-2D625C58D1C9}': 'Debbie',
    '{56A2B8F0-08C2-44DA-80A6-113982402043}': 'Matthew',
};

const GROUPS = {
    mens: {
        prefix: 'tournament-challenge-bracket',
        group_id: '5a64cc67-7fc4-3fb2-9c9c-6c0d92a85b8c',
    },
    womens: {
        prefix: 'tournament-challenge-bracket-women',
        group_id: 'c1e10bcb-3f29-4203-a899-981ad9bd3b46',
    },
};

export async function fetchData(year: string): Promise<ClashData> {
    console.log('Fetching data for year', year);

    const scores: GroupBrackets[] = [];
    await Promise.all(
        Object.entries(GROUPS).map(async ([gender, details]) => {
            const responseJson = await getGroupScores(details.prefix, year, details.group_id);
            const overrideJson = await getOverrideGroupScores(gender, year);

            const overriddenResponseJson = overrideGroupScores(responseJson, overrideJson);

            scores.push(parseScores(overriddenResponseJson, gender));
        }),
    );

    const combinedScores = zipScores(scores);

    return combinedScores;
}

async function getGroupScores(
    prefix: string,
    year: string,
    group_id: string,
): Promise<ChallengeGroup> {
    const url = `https://gambit-api.fantasy.espn.com/apis/v1/challenges/${prefix}-${year}/groups/${group_id}`;

    const response = await fetch(url);
    return response.json() as Promise<ChallengeGroup>;
}

async function getOverrideGroupScores(gender: string, year: string): Promise<ChallengeGroup> {
    const manifest = await getOverrideManifest();

    if (!manifest[gender] || !manifest[gender][year]) {
        return { entries: [] };
    }

    const url = `assets/override/${gender}/${year}/override.json`;
    const overrideResponse = await fetch(url);

    return overrideResponse.json() as Promise<ChallengeGroup>;
}

async function getOverrideManifest(): Promise<OverrideManifest> {
    const manifestUrl = 'assets/override/manifest.json';
    const manifestResponse = await fetch(manifestUrl);
    return manifestResponse.json() as Promise<OverrideManifest>;
}

function overrideGroupScores(
    responseJson: ChallengeGroup,
    overrideJson: ChallengeGroup,
): ChallengeGroup {
    const overriddenEntries = responseJson.entries.map((entry) => {
        const overrideEntry = overrideJson.entries.find(
            (override) => override.member.id === entry.member.id,
        );

        if (overrideEntry) {
            return overrideEntry;
        }
        return entry;
    });

    return {
        entries: overriddenEntries,
    };
}

function parseScores(responseJson: ChallengeGroup, gender: string): GroupBrackets {
    return responseJson.entries.map((entry) => extractChallenger(gender, entry));
}

function extractChallenger(gender: string, entry: ChallengeEntry): MemberToBracket {
    return {
        [entry.member.id]: extractBracket(gender, entry.score.scoreByPeriod),
    };
}

function extractBracket(gender: string, scoreByPeriod: ChallengeScoreByPeriod): ClashBracket {
    const rounds = Object.entries(scoreByPeriod).map(([round, score]) =>
        extractRound(round, score),
    );

    return {
        gender,
        rounds,
    };
}

function extractRound(round: string, score: ChallengeRoundScore): ClashRoundScore {
    return {
        round,
        score: score.score,
        possiblePointsMax: score.possiblePointsMax,
    };
}

function zipScores(scores: GroupBrackets[]): ClashData {
    const challengerBrackets: MemberToBrackets = {};

    scores.forEach((genderScores) => {
        genderScores.forEach((score) => {
            Object.entries(score).forEach(([challenger, bracket]) => {
                if (!challengerBrackets[challenger]) {
                    challengerBrackets[challenger] = [];
                }
                challengerBrackets[challenger].push(bracket);
            });
        });
    });

    const combinedScores = Object.entries(challengerBrackets).map(([challenger, brackets]) => {
        return {
            displayName: ESPN_ID_MAP[challenger],
            brackets: brackets,
        };
    });

    const cleanedScores = combinedScores.filter((challenger) => challenger.displayName);

    return {
        challengers: cleanedScores,
    };
}

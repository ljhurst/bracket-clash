const ESPN_ID_MAP = {
    '{E00185BE-993E-425F-8185-BE993E625F84}': 'Luke',
    '{ABBA3098-00E7-4D1B-8ED0-0CF6E3D6CDC9}': 'Pete',
    '{CA11938A-A78D-4D6C-9227-1E4C19D8D0DA}': 'Emma S.',
    '{82BF5DF7-2F8E-47F7-9163-1F845FA2BD51}': 'Aaron',
    '{33B36EDF-89AF-4484-8878-FA2BB838FD4B}': 'Katy',
    '{A96363C0-81E1-4903-A58C-3A2740CC8B88}': 'Emma V.',
    '{36B40A82-310D-423A-9642-2D625C58D1C9}': 'Debbie',
    '{56A2B8F0-08C2-44DA-80A6-113982402043}': 'Matthew',
    '{0DF20C41-CA70-43ED-900B-D219925DB253}': 'Hannah',
};

const GROUPS = {
    mens: {
        prefix: 'tournament-challenge-bracket-2024',
        group_id: '5a64cc67-7fc4-3fb2-9c9c-6c0d92a85b8c',
    },
    womens: {
        prefix: 'tournament-challenge-bracket-women-2024',
        group_id: 'c1e10bcb-3f29-4203-a899-981ad9bd3b46',
    },
};

export async function fetchData() {
    const scores = [];
    await Promise.all(Object.entries(GROUPS).map(async ([gender, details]) => {
        const responseJson = await getGroupScores(details.prefix, details.group_id);

        scores.push(parseScores(responseJson, gender));
    }));

    const combinedScores = zipScores(scores);

    return combinedScores;
}

async function getGroupScores(prefix, group_id) {
    const url = `https://gambit-api.fantasy.espn.com/apis/v1/challenges/${prefix}/groups/${group_id}`;

    const response = await fetch(url);
    return response.json();
}

function parseScores(responseJson, gender) {
    return responseJson.entries.map(entry => extractChallenger(gender, entry));
}

function extractChallenger(gender, entry) {
    return {
        [entry.member.id]: extractBracket(gender, entry.score.scoreByPeriod),
    };
}

function extractBracket(gender, scoreByPeriod) {
    return {
        gender,
        rounds: Object.entries(scoreByPeriod).map(([round, score]) => {
            return {
                round,
                score: score.score,
                possiblePointsMax: score.possiblePointsMax,
            };
        })
    };
}

function zipScores(scores) {
    const challengerBrackets = {};

    scores.forEach(genderScores => {
        genderScores.forEach(score => {
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

    return {
        challengers: combinedScores
    };
}

import globals from 'globals';

export default [
    {
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            globals: {
                ...globals.browser,
                ...globals.es2021,
                ...globals.node,
                ...globals.jest,
            },
        },
        linterOptions: {
            reportUnusedDisableDirectives: true,
        },
        plugins: {
            import: await import('eslint-plugin-import')
        },
        rules: {
            // Possible Errors
            'no-console': ['warn', { allow: ['warn', 'error'] }],
            'no-debugger': 'warn',
            'no-duplicate-imports': 'error',
            'no-unused-vars': ['warn', {
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],

            // Best Practices
            'curly': ['error', 'all'],
            'default-case': 'warn',
            'eqeqeq': ['error', 'always'],
            'no-eval': 'error',
            'no-implied-eval': 'error',
            'no-return-await': 'error',
            'no-throw-literal': 'error',

            // Stylistic Issues
            'array-bracket-spacing': ['error', 'never'],
            'block-spacing': ['error', 'always'],
            'comma-dangle': ['error', 'always-multiline'],
            'comma-spacing': ['error', {
                before: false,
                after: true
            }],
            'indent': ['error', 4],
            'key-spacing': ['error', {
                beforeColon: false,
                afterColon: true
            }],
            'keyword-spacing': ['error', {
                before: true,
                after: true
            }],
            'max-len': ['warn', {
                code: 100,
                ignoreComments: true,
                ignoreStrings: true,
                ignoreTemplateLiterals: true,
                ignoreRegExpLiterals: true
            }],
            'no-mixed-spaces-and-tabs': 'error',
            'no-multi-spaces': 'error',
            'object-curly-spacing': ['error', 'always'],
            'quotes': ['error', 'single', {
                avoidEscape: true,
                allowTemplateLiterals: true
            }],
            'semi': ['error', 'always'],

            // ES6
            'no-var': 'error',
            'prefer-const': 'error',
            'prefer-template': 'error',

            // Imports
            'import/order': ['error', {
                'groups': [
                    'builtin',     // Built-in imports (come from NodeJS)
                    'external',     // npm install packages
                    'internal',     // Absolute imports
                    ['sibling', 'parent'], // Relative imports
                    'index',       // index imports
                    'unknown'      // unknown
                ],
                'newlines-between': 'always',
                'alphabetize': {
                    'order': 'asc',
                    'caseInsensitive': true
                }
            }],
        },
    },
    {
        files: ['**/*.test.js', 'tests/**/*.js'],
        rules: {
            'max-len': 'off',
        },
    },
];

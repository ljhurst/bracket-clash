import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettier from 'eslint-config-prettier';

export default tseslint.config(
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    ...tseslint.configs.recommendedTypeChecked,
    {
        languageOptions: {
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        plugins: {
            import: await import('eslint-plugin-import')
        },
      },
      {
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
        files: ['src/**/*.ts', 'test/**/*.ts'],
        rules: {
            'max-len': 'off',
        },
    },
);

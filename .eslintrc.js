const fs = require('node:fs');
const path = require('node:path');

const prettierOptions = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
    extends: [
        'prettier',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
    ],
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    root: true,
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir : __dirname,
        include: ['src/**/*'],
        sourceType: 'module',
    },
    env: {
        es6: true,
        node: true,
    },
    overrides: [
        {
            files: ['**/*.ts'],
            rules: { 'prettier/prettier': ['warn', prettierOptions] },
        },
    ],
    rules: {
        '@typescript-eslint/ban-ts-comment': 0,
        '@typescript-eslint/no-non-null-assertion': 0,
        'prettier/prettier': ['error', prettierOptions],
        'no-console': ['error', { 'allow': ['warn', 'error', 'info'] }],
    },
    ignorePatterns: ['swagger', '.eslintrc.js'],
};

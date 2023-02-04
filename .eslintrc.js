const fs = require('node:fs');
const path = require('node:path');

const prettierOptions = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '.prettierrc'), 'utf8')
);

module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint', 'prettier'],
    parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir : __dirname,
        sourceType: 'module',
    },
    env: {
        node: true,
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    overrides: [
        {
            files: ['**/*.ts'],
            rules: { 'prettier/prettier': ['warn', prettierOptions] },
        },
    ],
    rules: {
        '@typescript-eslint/no-non-null-assertion': 0,
        'no-console': 1, // Means warning
        'prettier/prettier': ['error', prettierOptions],
    },
};

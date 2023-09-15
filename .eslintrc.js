module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	ignorePatterns: ['node_modules/', 'workflows.js', 'sandbox.ts'],
	plugins: ['@typescript-eslint'],
	env: {
		jest: true,
	},
	extends: ['maqe', 'plugin:@typescript-eslint/recommended'],
	overrides: [
		{
			files: ['**/*.ts', '**/*.js'],
			rules: {
				'import/extensions': 'off',
				'import/first': 'off',
				'import/prefer-default-export': 'off',
				'implicit-arrow-linebreak': 'off',
				'function-paren-newline': 'off',
				'no-continue': 'off',
				'guard-for-in': 'off',
				camelcase: 'off',
				'no-shadow': 'off',
				'no-use-before-define': 'off',
				'no-await-in-loop': 'off',
				'max-classes-per-file': 'off',
				'@typescript-eslint/no-shadow': 'error',
				'@typescript-eslint/no-var-requires': 'off',
				'@typescript-eslint/no-namespace': 'off',
				'@typescript-eslint/array-type': ['error', { default: 'array' }],
				'@typescript-eslint/no-explicit-any': 'off',
				'@typescript-eslint/explicit-module-boundary-types': 'off',
				'@typescript-eslint/no-inferrable-types': 'off',
				'@typescript-eslint/ban-types': [
					'error',
					{
						types: {
							Function: false,
						},
						extendDefaults: true,
					},
				],
				// indent - note you must disable the base rule as it can report incorrect errors
				indent: 'off',
				'@typescript-eslint/indent': 'off',
				'no-unused-vars': 'off',
				'@typescript-eslint/no-unused-vars': [
					'warn',
					{
						argsIgnorePattern: '^_',
						varsIgnorePattern: '^_',
						caughtErrorsIgnorePattern: '^_',
					},
				],
			},
		},
		{
			files: ['**/*.test.ts'],
			rules: {
				'@typescript-eslint/no-non-null-assertion': 'off',
			},
		},
	],
};

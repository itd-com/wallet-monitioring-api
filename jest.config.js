require('dotenv').config();

module.exports = {
	transform: {
		'^.+\\.(t|j)sx?$': ['@swc/jest'],
	},
	testEnvironment: 'node',
	roots: ['src', 'tests'],
	setupFilesAfterEnv: [
		'./jest.setup.js',
	],
	testTimeout: 30000,
	moduleNameMapper: {
		'@domain/(.*)': '<rootDir>/src/domain/$1',
		'@controllers/(.*)': '<rootDir>/src/controllers/$1',
		'@transformer/(.*)': '<rootDir>/src/transformer/$1',
		'@controllers': '<rootDir>/src/controllers/index.ts',
		'@hooks/(.*)': '<rootDir>/src/hooks/$1',
		'@routers/(.*)': '<rootDir>/src/routers/$1',
		'@routers': '<rootDir>/src/routers/index.ts',
		'@helpers/(.*)': '<rootDir>/src/helpers/$1',
		'@config/(.*)': '<rootDir>/src/config/$1',
		'@config': '<rootDir>/src/config/index.ts',
		'@tests/(.*)': '<rootDir>/tests/$1',
		'@enums/(.*)': '<rootDir>/src/enums/$1',
		'@client/(.*)': '<rootDir>/src/client/$1',
	},
};

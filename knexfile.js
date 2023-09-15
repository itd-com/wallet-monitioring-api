const path = require('path');
require('dotenv').config();

const migrations = {
	directory: path.join(__dirname, 'database/migrations'),
	stub: path.join(__dirname, 'database/migration.js'),
};

const seeds = {
	directory: path.join(__dirname, 'database/seeds'),
};

const mysqlConfig = {
	client: 'mysql',
	connection: {
		host: process.env.DB_HOST,
		port: process.env.DB_PORT || 3306,
		database: process.env.DB_NAME,
		user: process.env.DB_USER,
		password: process.env.DB_PASSWORD,
		timezone: 'UTC',
		multipleStatements: true,
	},
	migrations,
	seeds,
};

const testConfig = {
	...mysqlConfig,
	connection: {
		...mysqlConfig.connection,
		database: `${mysqlConfig.connection.database}_test`,
	},
};

module.exports = {
	localhost: mysqlConfig,
	dev: mysqlConfig,
	qa: mysqlConfig,
	uat: mysqlConfig,
	'perf-test': mysqlConfig,
	'pen-test': mysqlConfig,
	preprod: mysqlConfig,
	production: mysqlConfig,
	prod: mysqlConfig,
	test: testConfig,
};

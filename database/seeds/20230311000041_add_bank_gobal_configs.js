exports.seed = async (knex) => {
	await knex('bankGlobalConfigs').insert([
		{
			class: 'SCB_APP',
			key: 'SCB_APP_USER_AGENT',
			value: 'IOS/16.5;FastEasy/3.66.2/6960',
		},
		{
			class: 'SCB_APP',
			key: 'SCB_APP_TILES_VERSION',
			value: '62',
		},
	]);
};

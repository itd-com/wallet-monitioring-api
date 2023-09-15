import app from '@tests/app';

describe('GET /api/rootbox/v1/healthcheck', () => {
	it('Healthcheck successfully with response 200', async () => {
		const response = await app.inject({
			method: 'get',
			url: '/api/minecraft/v1/healthcheck',
		});

		const body = JSON.parse(response.body);
		expect(body).toStrictEqual({
			result: 'OK',
		});
		expect(response.statusCode).toBe(200);
	});
});

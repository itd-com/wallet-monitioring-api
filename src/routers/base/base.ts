const baseRoute = async (app) => {
	app.get('/robots.txt', (_, reply) => reply.type('text/plain').send('User-agent: *\nDisallow: /'));
};

export default baseRoute;

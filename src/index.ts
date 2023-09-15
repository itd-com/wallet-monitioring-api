import { config } from '@config';
import { initApp } from './app';

initApp().listen(config.port, '0.0.0.0', (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}

	console.log(`Server listening at ${address} port ${config.port}`);
});

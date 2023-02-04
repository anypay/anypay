
require('dotenv').config()

const {exec} = require('child_process');

import { waitForDatabase } from '../lib/wait_port'

export default async function initialize() {

	await waitForDatabase()

	console.log('DONE AWAITING DATABASE?')

	await new Promise((resolve, reject) => {
	  const migrate = exec(
	    'npm run db:migrate',
	    {env: process.env},
	    err => (err ? reject(err): resolve())
	  );

	  // Forward stdout+stderr to this process
	  migrate.stdout.pipe(process.stdout);
	  migrate.stderr.pipe(process.stderr);
	});

}

if (require.main === module) {

	initialize()

}


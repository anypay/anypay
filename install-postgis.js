const { Client } = require('pg');

(async () => {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  });

  try {
    await client.connect();

    // Create the PostGIS extension
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis;');
    await client.query('CREATE EXTENSION IF NOT EXISTS postgis_topology;');

    console.log('PostGIS has been installed successfully.');

  } catch (err) {
    console.error('Error installing PostGIS:', err);
  } finally {
    await client.end();
  }
})();

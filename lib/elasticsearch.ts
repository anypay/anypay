
const es = require('elasticsearch');

const elasticsearch = new es.Client({
  host: process.env.ELASTICSEARCH_HOST || '127.0.0.1:9200',
  log: 'error'
});

export { elasticsearch }


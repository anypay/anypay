let StatsD = require('node-statsd')

let statsd = new StatsD({
  host: process.env.STATSD_HOST
});

export {
 
  statsd

}


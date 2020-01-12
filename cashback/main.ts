require('dotenv').config()

process.on('unhandledRejection', function(err, promise) {
  console.error('Unhandled rejection (promise: ', promise, ', reason: ', err, ').');
  process.exit(1);
});

//require('./actors/main').start();
require('./actors/customers').start();


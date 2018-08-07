require('dotenv').config();

require('./zeromqmonitor').start();

require('./hashtx_unprocessed').start();

require('./transaction_unprocessed').start();


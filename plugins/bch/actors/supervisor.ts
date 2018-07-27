require('dotenv').config();

require('./zeromqmonitor').start();

require('./hashblock_unprocessed').start();

require('./rawblock_unprocessed').start();

require('./hashtx_unprocessed').start();

require('./rawtx_unprocessed').start();

require('./transaction_unprocessed').start();



require('./bch_tx_forwarder/actor').start();
require('./invoice_created_importaddress/actor').start();
require('./publish.bch.payment/actor').start();
require('./transform_txid_to_tx/actor').start();


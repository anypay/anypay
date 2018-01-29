const EthereumInvoice = require('../lib/ethereum/invoice');

module.exports.generate = async function(options) {

  switch(options.currency) {
  case 'ETH':

    var invoice = await EthereumInvoice.generate(
      options.amount,
      options.account_id
    );

    return invoice;

    break;
  default:
    throw new Error(`currency ${options.currency} not supported`);
  }
}

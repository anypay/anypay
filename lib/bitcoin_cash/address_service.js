const address = '1JrzvsA4p9D8LBwxWvxChCm3SAsvpWvZy1';

module.exports.getNewAddress = () => {

  console.log('bitcoin_cash:getnewaddress');

  return Promise.resolve(address);
}


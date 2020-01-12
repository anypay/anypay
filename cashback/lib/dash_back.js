const configuration = {

  merchants: {

    strategy: 'percent-with-upper-lower-limits',

    percent: 20,

    upper: {
      currency: 'USD',
      amount: 20
    },

    lower: {
      currency: 'USD',
      amount: 1
    }
  },

  customers: {

    strategy: 'percent-with-upper-lower-limits',

    percent: 10,

    upper: {
      amount: 10
    },

    lower: {
      amount: 1
    }
  }
};

module.exports.computeForCustomer = async function(invoiceAmount) {

  if (!invoiceAmount) {
    throw new Error('dollar amount required');
  };

  let config = configuration.customers;

  switch(config.strategy) {
    case 'percent-with-upper-lower-limits':

      var percent = config.percent * 0.01 * invoiceAmount;
      
      if (percent < config.lower.amount) {

        return config.lower.amount;

      } else if (percent > config.upper.amount) {

        return config.upper.amount;

      } else {

        return percent;
      }

      break;

    default: 

      return 1;
  }
}

module.exports.computeForMerchant = async function(invoiceAmount) {

  if (!invoiceAmount) {
    throw new Error('invoice amount required');
  };

  let config = configuration.merchants;

  switch(config.strategy) {
    case 'percent-with-upper-lower-limits':

      var percent = config.percent * 0.01 * invoiceAmount;
      
      if (percent < config.lower.amount) {

        return config.lower.amount;

      } else if (percent > config.upper.amount) {

        return config.upper.amount;

      } else {

        return percent;
      }

      break;

    default: 

      return 1;
  }
}



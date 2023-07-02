'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Payment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  Payment.init({

    invoice_uid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    account_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    payment_option_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    txid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    currency: {
      type: DataTypes.STRING,
      allowNull: false
    },
    chain: {
      type: DataTypes.STRING,
      allowNull: true
    },
    txhex: {
      type: DataTypes.STRING,
    },
    tx_key: {
      type: DataTypes.STRING,
    },
    txjson: {
      type: DataTypes.JSON
    },
    wallet: {
      type: DataTypes.STRING,
    },
    ip_address: {
      type: DataTypes.STRING,
    },
    total_input: {
      type: DataTypes.INTEGER,
    },
    total_output: {
      type: DataTypes.INTEGER,
    },
    network_fee: {
      type: DataTypes.INTEGER,
    },
    confirmation_hash: {
      type: DataTypes.STRING,
    },
    confirmation_date: {
      type: DataTypes.DATE,
    },
    confirmation_height: {
      type: DataTypes.INTEGER
    },
    status: {
      type: DataTypes.STRING
    },
    block_explorer_url: {
      type: DataTypes.VIRTUAL,
      get() {

        switch(this.chain) {

          case 'MATIC':

            return `https://polygonscan.com/tx/${this.txid}`

          case 'AVAX':

            return `https://snowtrace.io/tx/${this.txid}`

          case 'ETH':

            return `https://etherscan.io/tx/${this.txid}`

          case 'SOL':

            return `https://explorer.solana.com/tx/${this.txid}`

          case 'XRP':

            return `https://xrpscan.com/tx/${this.txid}`

          case 'BTC':

            return `https://blockchair.com/bitcoin/transaction/${this.txid}`

          case 'LTC':

            return `https://blockchair.com/litecoin/transaction/${this.txid}`

          case 'BCH':

            return `https://blockchair.com/bitcoin-cash/transaction/${this.txid}`

          case 'DOGE':

            return `https://blockchair.com/dogecoin/transaction/${this.txid}`

          case 'DASH':

            return `https://insight.dash.org/insight/tx/${this.txid}`

          case 'XMR':

            return `https://localmonero.co/blocks/tx/${this.txid}`

          default:
    
            return `https://blockchair.com/bitcoin/transaction/${this.txid}`

        } 
      }
    }

  }, {
    sequelize,
    modelName: 'Payment',
    tableName: 'payments'
  });
  return Payment;
};

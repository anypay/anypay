const EventEmitter = require("events").EventEmitter;

const DashCore = require("../../lib/dashcore");

// poll dashd for new 

/*
//////////////////
 STATE VARIABLES
//////////////////

LATEST_BLOCK String
BLOCK_TRANSACTIONS {String: Boolean}

*/

var LATEST_BLOCK

const BLOCK_TRANSACTIONS = {}

function updateBlockTransactions(blockHash, transactionHashes) {
  BLOCK_TRANSACTIONS[blockHash] = transactionHashes;
}

function parseNewBlockTransactions(blockHash, newHashes) {

  if (!BLOCK_TRANSACTIONS[blockHash]) {
    BLOCK_TRANSACTIONS[blockHash] = [];
  }

  return newHashes.filter(function(i) {
    return BLOCK_TRANSACTIONS[blockHash].indexOf(i) < 0;
  });
}

/*
//////////////////
 EVENTS
//////////////////

instantsend:received
basicsend:received

*/

const vent = new EventEmitter();

module.exports.vent = vent;

/*
//////////////////////////
  START & STOP FUNCTIONS
//////////////////////////
*/

function findTransactionById(transactions, txid) {

  return transactions.filter(function(tx) {
    return tx.txid === txid;
  })[0];
}

function fetchNewTransactions() {

  return new Promise((resolve, reject) => {

    getLatestBlock().then(latestBlock => {

      if (!latestBlock) {
        return DashCore.getBestBlockHash();
      } else {
        return latestBlock;
      }
    })
    .then(blockHash => {

      return DashCore.listSinceBlock(blockHash).then(transactions => {
        let txids = transactions.transactions.map(tx => {
          return tx.txid;
        });

        let newTxs = parseNewBlockTransactions(blockHash, txids);

        let txs = newTxs.map(txid => {
          return findTransactionById(transactions.transactions, txid);
        });

        if (newTxs.length > 0) {

          txs.forEach(newTx => {
            if (newTx.confirmations >= 5) {
              vent.emit('instantsend:received', newTx);
            } else {
              vent.emit('normalsend:received', newTx);
            }
          });

          updateBlockTransactions(blockHash, txids);
        }

      });
    })
    .catch(console.error);

  });
}

module.exports.start = function() {

  setInterval(function() {

    fetchNewTransactions();

  }, 5000)
}

module.exports.stop = function() {

}

function getLatestBlock() {
  return new Promise((resolve, reject) => {

    let hash='0000000000000fddf6d73a6148bedd47e689f406e6f164c59a60bde5a308ca72';

    resolve(hash);
  });
}

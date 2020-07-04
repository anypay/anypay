import {rpc} from '../dashd_rpc';
import { findById } from '../account';

async function getInvoiceFromUid(invoiceId) {
	return {
		hash: 'e737c3183c3876048146a6d29514c3bd55e433c9c06332a9eee045c14f861b74',
    address: 'XahqMnPjFR6yEgeLhwS9wS4H4beGtyVxcc',
    status: 'paid'
	}
}

async function getRawTxFromHash(txHash) {
  let resp = await rpc.getRawTransactionAsync([txHash]);

  return resp.result;
}

function getTxJsonFromRawTx(rawTx) {

	return new Promise((resolve, reject) => {
		rpc.decodeRawTransaction([rawTx], (err, resp) => {
			if (err) { return reject(err) }
			resolve(resp.result);
		});
	});
}

function getChangeAddressFromTxJsonAndDestination(txJson, destinationAddress) {
  console.log(txJson);

  let feeAddress = 'Xwh247FF6SWymYLiJsMjM1BfrqVkzya6wh';

  let changeAddress = txJson.vout.map(output => {
    return output.scriptPubKey.addresses[0];
  })
  .filter(address => address != destinationAddress)
  .filter(address => address != feeAddress)[0]

  return changeAddress;
}

async function getSendingAddressesFromInvoice(invoice) {

	let rawTx = await getRawTxFromHash(invoice.hash);
	let txJson = await getTxJsonFromRawTx(rawTx);

}

async function getChangeAddressFromInvoice(invoice) {

  // Here look up different coin plugins for logic
  // to parse change addresses 

  console.log('rawtx:getfromhash', invoice.hash);

	let rawTx = await getRawTxFromHash(invoice.hash);

  console.log('txjson:getfromraw', rawTx);
	let txJson = await getTxJsonFromRawTx(rawTx);

  let changeAddress = getChangeAddressFromTxJsonAndDestination(
		txJson, invoice.address
	)

  if (!changeAddress) {

    let inputTx = await getRawTxFromHash(txJson.vin[0].txid);

    console.log('inputtx', inputTx);

    let inputTxJson = await getTxJsonFromRawTx(inputTx);

    console.log('inputtxjson', inputTxJson);
    
    changeAddress = inputTxJson.vout[0].scriptPubKey.addresses[0];

  }

	return changeAddress;
}


async function getChangeAddressFromInvoiceId(invoiceId) {

	let invoice = await getInvoiceFromUid(invoiceId)

  let address = getChangeAddressFromInvoice(invoice);

  return address;
}

async function getDashAddressFromAccount(accountId) {

  let account = await findById(accountId);

  return account.dash_payout_address;
}

export {
  getChangeAddressFromInvoice,
  getChangeAddressFromInvoiceId,
  getDashAddressFromAccount
}


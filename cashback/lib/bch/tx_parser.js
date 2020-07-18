import { findById } from '../account';
import { rpc } from './rpc';
import * as jsonrpc from './jsonrpc';

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

  let feeAddress = 'bitcoincash:qrggz7d0sgv4v3d0jl7lj4mv2vdnv0vqjsq48qtvt6';

  return txJson.vout.map(output => {
    return output.scriptPubKey.addresses[0];
  })
  .filter(address => address != destinationAddress)
  .filter(address => address != feeAddress)[0]
}

async function getChangeAddressFromInvoice(invoice) {

  // Here look up different coin plugins for logic
  // to parse change addresses 

  console.log('rpc.gettransaction', invoice.hash);

	let tx = await jsonrpc.rpc.call('gettransaction', [invoice.hash]);

  let txJson = await getTxJsonFromRawTx(tx.hex);

  console.log('txjson', txJson);

  let changeAddress = getChangeAddressFromTxJsonAndDestination(
		txJson, invoice.address
	)

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


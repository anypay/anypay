import {models} from '../index';

export async function writeTransactionRecord(event){

  let newRow = event.affectedRows[0].after;

  let vendingMachine = await models.VendingMachine.findOne({where:{terminal_id: newRow.terminal_id}})

  let accountId, vendingMachineId; 

  if( vendingMachine){
    accountId = vendingMachine.account_id;
    vendingMachineId = vendingMachine.id;
  }

  if( newRow.type === 0){
    newRow.type = 'BUY';
  }
  if( newRow.type === 1){
    newRow.type = 'SELL';
  }


  let record = {
    account_id: accountId,
    vending_machine_id: vendingMachineId,
    terminal_id: newRow.terminal_id,
    server_time: new Date(event.timestamp),
    terminal_time: new Date(event.timestamp),
    localtid: newRow.localtid,
    remotetid: newRow.remotetid,
    type: newRow.type,
    cash_amount: newRow.cashamount,
    cash_currency: newRow.cashcurrency,
    crypto_currency: newRow.cryptocurrency,
    crypto_amount: newRow.cryptoamount,
    crypto_address: newRow.cryptoaddress,
    status: newRow.status,
    hash: newRow.detail,
    exchange_price: (newRow.ratesourceprice * (1+ newRow.expectedprofitsetting/100)).toFixed(2),
    spot_price: (newRow.ratesourceprice).toFixed(2),
    fixed_transaction_fee: (newRow.fixedtransactionfee).toFixed(2),
    expected_profit_setting: (newRow.expectedprofitsetting).toFixed(2),
    expected_profit_value: (newRow.expectedprofitvalue).toFixed(2),
    name_of_crypto_setting_used: newRow.nameofcryptosettingused      
  }
  let tx = await models.VendingTransaction.findOrCreate({
    where:{
      terminal_id: record.terminal_id.toString(),
      hash : record.hash,
      crypto_address: record.crypto_address
    },
    defaults: record
  })

  return tx

}

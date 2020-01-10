import {models} from '../index';


const mysql = require('mysql');

const dsn = {
  host:     process.env.MYSQL_HOST,
  user:     process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: 'batm',
  connectionLimit: 100
};

const connection = mysql.createConnection(dsn);

export async function getLatestTransactionRecords(){

  return new Promise( (resolve, reject)=>{

    connection.query('select * from transactionrecord order by Id desc limit 1000;', (err, rows, fields)=>{
  
      if(err){
        return reject(err)
      }

      resolve(rows)

    });

  });

}

export async function writeTransactionRecords(records:any){

  let results = await Promise.all(records.map(async (record)=>{

    let vendingMachine = await models.VendingMachine.findOne({where:{terminal_id: record.terminal_id}})

    let accountId, vendingMachineId; 

    if( vendingMachine){

      accountId = vendingMachine.account_id;

      vendingMachineId = vendingMachine.id;

      if( record.type === 0){
        record.type = 'BUY';
      }
      if( record.type === 1){
        record.type = 'SELL';
      }

      let tx = {
        account_id: accountId,
        vending_machine_id: vendingMachineId,
        terminal_id: record.terminal_id,
        server_time: new Date(record.servertime),
        terminal_time: new Date(record.terminaltime),
        localtid: record.localtid,
        remotetid: record.remotetid,
        type: record.type,
        cash_amount: record.cashamount,
        cash_currency: record.cashcurrency,
        crypto_currency: record.cryptocurrency,
        crypto_amount: record.cryptoamount,
        crypto_address: record.cryptoaddress,
        status: record.status,
        hash: record.detail,
        exchange_price: (record.ratesourceprice * (1+ record.expectedprofitsetting/100)).toFixed(2),
        spot_price: (record.ratesourceprice).toFixed(2),
        fixed_transaction_fee: (record.fixedtransactionfee).toFixed(2),
        expected_profit_setting: (record.expectedprofitsetting).toFixed(2),
        expected_profit_value: (record.expectedprofitvalue).toFixed(2),
        name_of_crypto_setting_used: record.nameofcryptosettingused,
        additional_output_strategy_id: vendingMachine.additional_output_strategy_id
      }

      let [result, isNew] = await models.VendingTransaction.findOrCreate({
        where:{
          terminal_id: tx.terminal_id.toString(),
          hash : tx.hash,
          crypto_address: tx.crypto_address,
          localtid : tx.localtid
        },
        defaults: tx
      })

      if( isNew ){
       
        await writeAsVendingOutput(result)
    
      }

      return result

    }

  }));

  return results

}

export async function writeAsVendingOutput(tx):Promise<any>{

  if( tx.status === 'BUY' && tx.status === '1' && tx.hash){

    let vendingOutput = {
      vending_transaction_id: tx.id,
      strategy_id : tx.additional_output_strategy_id,
      isKioskCutomer: true,
      currency: tx.crypto_currency,
      amount: tx.amount, 
      address: tx.address
    }

    let result = await models.VendingTransactionOutput.create({ vendingOutput });

    return result

  }

  return {}

}

export async function writeTransactionRecord(event){

  let newRow = event.affectedRows[0].after;

  let vendingMachine = await models.VendingMachine.findOne({where:{terminal_id: newRow.terminal_id}})

  let accountId, vendingMachineId; 

  if( vendingMachine){

    accountId = vendingMachine.account_id;
    vendingMachineId = vendingMachine.id;

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
      name_of_crypto_setting_used: newRow.nameofcryptosettingused,
      additional_output_strategy_id: vendingMachine.additional_output_strategy_id
    }
    let [tx, isNew] = await models.VendingTransaction.findOrCreate({
      where:{
        terminal_id: record.terminal_id.toString(),
        hash : record.hash,
        crypto_address: record.crypto_address,
        localtid: newRow.localtid
      },
      defaults: record
    })

    if(isNew){
    
      await writeAsVendingOutput(tx);

    }

    return tx

  }

  throw new Error(`No vending machine record associated with terminal id: ${newRow.id}`)
}

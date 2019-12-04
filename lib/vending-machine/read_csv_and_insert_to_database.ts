require('dotenv').config();
import {models} from '../models';

export function importVendingCsv(path){

  console.log(path)
  var fs = require('fs');
  var parse = require('csv-parse');
  var async = require('async');

  var inputFile= path;

  var parser = parse({delimiter: ','}, function (err, data) {

    async.eachSeries(data, async (line, callback)=> {

     try{


      let tx = await  models.VendingTransaction.create( {
        terminal_id: line[1],
        server_time: line[2],
        terminal_time: line[3],
        localtid: line[4],
        remotetid: line[5],
        type: line[6],
        cash_amount: Number(line[7]),
        cash_currency: line[8],
        crypto_amount: Number(line[9]),
        crypto_currency: line[10],
        crypto_address: line[13],
        status: line[16],
        detail: line[18],
        exchange_strategy_used: line[20],
        rate_source_price: Number(line[21]),
        fixed_transaction_fee: Number(line[22]),
        expected_profit_setting: line[23],
        expected_profit_value: Number(line[24]),
        name_of_crypto_setting_used: line[25]

      })

      console.log(tx.toJSON())

     }catch(err){
      console.log(err)
     }

      callback();
    })
  });

  fs.createReadStream(inputFile).pipe(parser)

}

importVendingCsv("./lib/vending-machine/general_bytes_2016_05_04_2019-10-04.csv")

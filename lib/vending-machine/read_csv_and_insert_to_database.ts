require('dotenv').config();
import {models} from '../models';

export async function importVendingCsv(path){

  var fs = require('fs');
  var parse = require('csv-parse');
  var async = require('async');

  var inputFile= path;

  var parser = parse({delimiter: ','}, function (err, data) {

    async.eachSeries(data, async (line, callback)=> {

     try{

       if(line[24] === "" ){
        line[24] = 0;
       }

       let tx = await  models.VendingTransaction.findOrCreate({
         where:{
           terminal_id: line[1],
           hash : line[18],
           crypto_address: line[13]
          },
         defaults: {
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
           hash: line[18],
           exchange_price: Number(line[20]).toFixed(2),
           spot_price: Number(line[21]).toFixed(2),
           fixed_transaction_fee: Number(line[22]),
           expected_profit_setting: Number(line[23]).toFixed(2),
           expected_profit_value: Number(line[24]).toFixed(2),
           name_of_crypto_setting_used: line[25]
        }

      })

      console.log(tx)

     }catch(err){
      console.log(err)
     }

      callback();
    })
  });

  await fs.createReadStream(inputFile).pipe(parser)

  return 'done';

}

importVendingCsv("/Users/bit1/github/anypay/lib/vending-machine/general_bytes_2016_05_04_2019-10-04.csv")

require('dotenv').config();

import * as assert from 'assert';
import * as Chance from 'chance';
import {writeTransactionRecord} from '../../lib/mysql';
import {models} from '../../lib';

const chance = new Chance();

const affectedRows = [{ after: {
  id: 4,
  autoexecuted: false,
  canbeallocatedforwithdrawal: null,
  canbecashedout: null,
  cashamount: 10,
  cashcurrency: 'USD',
  cellphoneused: null,
  cryptoaddress: '1ErXKwhQCGV9zYAFcmfjqdEPJLp3qRELwM',
  cryptoamount: 0.00148679,
  cryptocurrency: 'BTC',
  cryptodiscountamount: 0,
  detail: '130ed2d4543cee8572034c4fd47d67098e7dc8d731b338a71cde4463fffb6421',
  discountcode: null,
  discountquotient: null,
  errorcode: 0,
  exchangestrategyused: 0,
  expectedprofitsetting: 0,
  expectedprofitvalue: 0,
  feediscount: null,
  fixedtransactionfee: 0,
  localtid: chance.word(),
  nameofcryptosettingused: 'BTC',
  note: null,
  purchased: false,
  ratesourceprice: 6725.9,
  relatedremotetid: null,
  remotetid: 'R3M78I',
  risk: null,
        //servertime: '2019-12-17T23:13:59.000Z',
  sold: null,
  status: 1,
        // terminaltime: '2019-12-18T00:13:59.000Z',
  type: 0,
  uuid: null,
  withdrawn: null,
  discount_id: null,
  identity_id: null,
  terminal_id: 4
}}];

const event = {
  type: 'INSERT',
  schema: 'batm',
  table: 'transactionrecord',
  affectedRows: affectedRows,
  affectedColumns: [
    'id',
    'autoexecuted',
    'canbeallocatedforwithdrawal',
    'canbecashedout',
    'cashamount',
    'cashcurrency',
    'cellphoneused',
    'cryptoaddress',
    'cryptoamount',
    'cryptocurrency',
    'cryptodiscountamount',
    'detail',
    'discountcode',
    'discountquotient',
    'errorcode',
    'exchangestrategyused',
    'expectedprofitsetting',
    'expectedprofitvalue',
    'feediscount',
    'fixedtransactionfee',
    'localtid',
    'nameofcryptosettingused',
    'note',
    'purchased',
    'ratesourceprice',
    'relatedremotetid',
    'remotetid',
    'risk',
    'servertime',
    'sold',
    'status',
    'terminaltime',
    'type',
    'uuid',
    'withdrawn',
    'discount_id',
    'identity_id',
    'terminal_id'
  ],
  timestamp: 1576606438000,
  nextPosition: 2106297,
  binlogName: 'mysql-bin.000001'
}


describe('Mysql event listeners', () => {
 
  before(async () => {

    await models.VendingMachine.findOrCreate({
      where: { 
        serial_number: 'BT101620' 
      }, 
      defaults: {
        serial_number:'BT101620', 
        current_location_name: 'AnypayHQ', 
        current_location_address:'110 State St Portsmouth, NH',
        machine_type: 'BATM2', 
        status: 'online', 
        account_id:1559, 
        terminal_id: 1
       }
    })

  });

 it("should write new transaction record to database", async () => {

   let tx = await writeTransactionRecord(event);
   console.log(tx)
   assert.strictEqual(tx.hash, '130ed2d4543cee8572034c4fd47d67098e7dc8d731b338a71cde4463fffb6421')
       

  });

});



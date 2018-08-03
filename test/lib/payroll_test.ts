require('dotenv').config();

//import {calculateDaily} from '../../lib/payroll';
import * as db from '../../lib/database';

describe("Payroll", () => {

  describe("Calculating Daily Payroll For Account", () => {

    it("#calculateDaily should calculate the amount of DASH", async () => {

      let result = await db.query('select email, * from payroll_accounts inner join accounts on accounts.id = payroll_accounts.account_id');

      result[0].forEach(row => {
        console.log(row);
      });

      //let amount = await calculateDaily();

    });

  });

});



import {getCustomerTotalsAllTime} from '../../../lib/dashback';
import {getMerchantTotalsAllTime} from '../../../lib/dashback';

export async function dashbackTotalsAlltime() {

  let customers = await getCustomerTotalsAllTime();

  let merchants = await getMerchantTotalsAllTime();

  let all = customers + merchants;

  return {

    totals: {

      customers,

      merchants,

      all

    }

  }

}

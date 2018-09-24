
import {

  getCustomerTotalsAllTime,

  getMerchantTotalsAllTime,

  getCustomerTotalsByMonth,

  getMerchantTotalsByMonth 

} from '../../../lib/dashback';


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

export async function dashbackTotalsByMonth() {

  let customers = await getCustomerTotalsByMonth();

  let merchants = await getMerchantTotalsByMonth();

  return {

    totals: {

      customers,

      merchants

    }

  }

}


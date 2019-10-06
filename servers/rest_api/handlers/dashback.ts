
import {

  getCustomerTotalsAllTime,

  getMerchantTotalsAllTime,

  getCustomerTotalsByMonth,

  getMerchantTotalsByMonth 

} from '../../../lib/cashback';


export async function dashbackTotalsAlltime() {

  let customers = await getCustomerTotalsAllTime("DASH");

  let merchants = await getMerchantTotalsAllTime("DASH");

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

  let customers = await getCustomerTotalsByMonth("DASH");

  let merchants = await getMerchantTotalsByMonth("DASH");

  return {

    totals: {

      customers,

      merchants

    }

  }

}


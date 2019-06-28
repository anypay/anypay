const moment = require('moment'); 

import * as database from '../database'

const movingAverage = (data, numberOfPricePoints) => {
  return data.map((row, index, total) => {
    const start = Math.max(0, index - numberOfPricePoints);
    const end = index;
    const subset = total.slice(start, end + 1);
    const sum = subset.reduce((a, b) => {
      return a + b['volume'];
    }, 0);

    return {
      date: row['date'],
      average: sum / subset.length
    };
  });
};

export async function getVolume(id){

  const query = `with A as (SELECT date_trunc('day', dd):: date as date FROM generate_series('2019-01-01'::timestamp, now()::timestamp, '1 day'::interval) dd), B as (SELECT currency as dash, sum(denomination_amount_paid) as dash_volume, date_trunc('day', completed_at) :: date as date FROM invoices where not denomination_amount_paid = 0 and account_id=${id} and currency='DASH' group by dash, date_trunc('day',completed_at)), C as (SELECT currency as bch, sum(denomination_amount_paid) as bch_volume, date_trunc('day', completed_at) :: date as date FROM invoices where not denomination_amount_paid = 0 and account_id=${id} and currency='BCH' group by bch, date_trunc('day',completed_at)), D as (SELECT currency as btc, sum(denomination_amount_paid) as btc_volume, date_trunc('day', completed_at) :: date as date FROM invoices where not denomination_amount_paid = 0 and account_id=${id} and currency='BTC' group by btc, date_trunc('day',completed_at)) Select A.date,CAST(COALESCE(dash_volume,0) AS DECIMAL) as dash_volume,  CAST(COALESCE(bch_volume,0) AS DECIMAL) as bch_volume,  CAST(COALESCE(btc_volume,0) AS DECIMAL) as btc_volume FROM A LEFT JOIN B ON A.date=B.date LEFT JOIN C ON A.date=C.date LEFT JOIN D ON A.date=D.date`

  try{
   
     let resp = await database.query(query)

     let data = {
       "chart": {
          "timestamp": [],
          "bch_volume": [],
          "dash_volume": [],
          "btc_volume": []
        }
      };

     resp[0].map( elem => {
       data['chart']['timestamp'].push(moment(elem.date).unix())
       data['chart']['bch_volume'].push(parseFloat(elem.bch_volume))
       data['chart']['dash_volume'].push(parseFloat(elem.dash_volume))
       data['chart']['btc_volume'].push(parseFloat(elem.btc_volume))

     })

     return data
   
   }catch(error){
   
     console.log(error)
   
  }

}



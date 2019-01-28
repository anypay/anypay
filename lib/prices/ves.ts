import * as http from 'superagent';

var dollarTodayPriceDataCache = null;

var refreshInterval;

async function updateDollarTodayPriceDataCache() {

  let data = await http.get('https://s3.amazonaws.com/dolartoday/data.json');

  if (data.body._antibloqueo) {

    dollarTodayPriceDataCache = data.body;
    
  }

}

async function getDollarTodayPriceData() {

  if (!dollarTodayPriceDataCache) {

    await updateDollarTodayPriceDataCache();

  }

  return dollarTodayPriceDataCache;

}

export async function getPriceOfOneDollarInVES() {

  return (await getDollarTodayPriceData())['USD']['dolartoday'];

}

export async function getPriceOfOneDASHInVES() {

  let resp = await http.get('https://api.get-spark.com/ves')

  return resp.body['VES'];

}

export async function periodicallyRefresh(interval) {

  if (!refreshInterval) {

    refreshInterval = setInterval(async () => {

      await updateDollarTodayPriceDataCache(); 

    }, interval);

  }

}


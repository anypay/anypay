require('dotenv').config()

let coins = [];
 
coins['DASH'] =  {
    "host": process.env.DASH_RPC_HOST,
    "port": process.env.DASH_RPC_PORT,
    "user": process.env.DASH_RPC_USER,
    "password": process.env.DASH_RPC_PASSWORD,
    "fee": .0001,
}

coins['BCH'] = {

    "host": process.env.BCH_RPC_HOST,
    "port": process.env.BCH_RPC_PORT,
    "user": process.env.BCH_RPC_USER,
    "password": process.env.BCH_RPC_PASSWORD,
    "fee": .0001,
}

coins['ZEN'] = {

    "host": process.env.ZEN_RPC_HOST,
    "port": process.env.ZEN_RPC_PORT,
    "user": process.env.ZEN_RPC_USER,
    "password": process.env.ZEN_RPC_PASSWORD,
    "fee": .01,
}

coins['LTC'] = {

    "host": process.env.LTC_RPC_HOST,
    "port": process.env.LTC_RPC_PORT,
    "user": process.env.LTC_RPC_USER,
    "password": process.env.LTC_RPC_PASSWORD,
    "fee": .001,
}

coins['DOGE'] = {

    "host": process.env.DOGE_RPC_HOST,
    "port": process.env.DOGE_RPC_PORT,
    "user": process.env.DOGE_RPC_USER,
    "password": process.env.DOGE_RPC_PASSWORD,
    "fee": 1,
}

coins['SMART'] = {

    "host": process.env.SMART_RPC_HOST,
    "port": process.env.SMART_RPC_PORT,
    "user": process.env.SMART_RPC_USER,
    "password": process.env.SMART_RPC_PASSWORD,
    "fee": 1,
}

coins['RVN'] = {

    "host": process.env.RVN_RPC_HOST,
    "port": process.env.RVN_RPC_PORT,
    "user": process.env.RVN_RPC_USER,
    "password": process.env.RVN_RPC_PASSWORD,
    "fee": .1,
}

coins['BTC'] = {

    "host": process.env.BTC_RPC_HOST,
    "port": process.env.BTC_RPC_PORT,
    "user": process.env.BTC_RPC_USER,
    "password": process.env.BTC_RPC_PASSWORD,
    "fee": .0001,
}

coins['ZEC'] = {

    "host": process.env.ZEC_RPC_HOST,
    "port": process.env.ZEC_RPC_PORT,
    "user": process.env.ZEC_RPC_USER,
    "password": process.env.ZEC_RPC_PASSWORD,
    "fee": .001,
}

coins['BSV'] = {

    "host": process.env.BSV_RPC_HOST,
    "port": process.env.BSV_RPC_PORT,
    "user": process.env.BSV_RPC_USER,
    "password": process.env.BSV_RPC_PASSWORD,
    "fee": .0001
}


export { coins }; 


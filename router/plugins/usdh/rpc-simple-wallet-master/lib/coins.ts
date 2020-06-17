require('dotenv').config()

let coins = [];


coins['BCH'] = {

    "host": process.env.BCH_RPC_HOST,
    "port": process.env.BCH_RPC_PORT,
    "user": process.env.BCH_RPC_USER,
    "password": process.env.BCH_RPC_PASSWORD,
    "fee": .00001,
}




export { coins }; 


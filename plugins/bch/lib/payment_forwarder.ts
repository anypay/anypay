const JsonRpc = require('./jsonrpc');

const redis = require("redis");
const bluebird = require('bluebird');

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || '127.0.0.1'
});

let rpc = new JsonRpc(); 

interface PaymentForwader {
  input: string;
  output: string;
}

// returns address
export async function setupPaymentForward(destination: string): Promise<PaymentForwader> {

  var inputAddress = (await rpc.call("getnewaddress", [])).result

  await redisClient.setAsync(inputAddress, destination);

  return {
    input: inputAddress,
    output: destination
  };
}

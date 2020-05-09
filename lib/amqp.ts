import {connect, Connection, Channel} from 'amqplib';

var connection: Connection;
var channel: Channel;

var channelIsConnected = false;

function wait(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });

}

async function awaitChannel() {

  while (!channelIsConnected) {

    await wait(100);

  }

  return channel;

}

export async function publish(routingKey: string, json={}) {

  let channel = await awaitChannel();

  return publishJson(channel, 'anypay.events', routingKey, json);
}

export async function publishJson(channel, exchange, routingkey, json) {
  return channel.publish(exchange, routingkey, Buffer.from(
    JSON.stringify(json)
  ));
}

(async function() {

  connection = await connect(process.env.AMQP_URL);
 
  channel = await connection.createChannel();  

  channelIsConnected = true;
  
})();
  
export {
 
  connection, channel, awaitChannel, wait

}

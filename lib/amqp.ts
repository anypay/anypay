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

(async function() {

  connection = await connect(process.env.AMQP_URL);
 
  channel = await connection.createChannel();  

  channelIsConnected = true;
  
})();
  
export {
 
  connection, channel, awaitChannel

}

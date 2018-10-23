import {connect, Connection, Channel} from 'amqplib';

var connection: Connection;
var channel: Channel;

(async function() {

  connection = await connect(process.env.AMQP_URL);

  channel = await connection.createChannel();  

})();

export {

  connection, channel

}


import * as amqplib from 'amqplib';

/***********

anypay.core.amqplib

Anypay publishes events to an AMQP message exchange,
to which other components can react.


***********/

const EXCHANGE = 'anypay';

class AnypayCoreAmqp {
  connection: amqplib.Connection;
  channel: amqplib.Channel;
  exchange: string = 'anypay';

  async publish(routingKey: string, json: string) {

    await this.channel.publish(this.exchange, routingKey, Buffer.from(json));
  }

  async initialize() {
    this.connection = await amqplib.connect(process.env.AMQP_URL);
    this.channel = await this.connection.createChannel();
  }
};

const amqp = new AnypayCoreAmqp();

export { amqp };


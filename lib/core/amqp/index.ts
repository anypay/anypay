
/***********

anypay.core.amqp

Anypay publishes events to an AMQP message exchange,
to which other components can react.


***********/

const EXCHANGE = 'anypay';

class AnypayCoreAmqp {
  connection: amqp.Connection;
  channel: amqp.Channel;
  exchange: string = 'anypay';

  async publish(routingKey: string, json: string) {

    await this.connection.publish(this.exchange, routingKey, new Buffer(json));
  }
};

const amqp = new AnypayCoreAmqp();

export { amqp };


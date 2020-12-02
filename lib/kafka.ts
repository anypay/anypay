
var kafka = require('kafka-node'),
    Producer = kafka.Producer,
    KeyedMessage = kafka.KeyedMessage,
    client = new kafka.KafkaClient({
      kafkaHost: process.env.KAFKA_HOST 
    }),
    producer = new Producer(client);

var producerReady = false

producer.on('ready', () => {

  producerReady = true

})

export function produce(topic, message) {

  return new Promise((resolve, reject) => {

    producer.send[{ topic, message }], function(err, data) {

      if (err) { reject(err) }

      resolve(data)

    })

  })

}

export async function producerIsReady() {

  while (!producerReady) {

    await wait(100)

  }

}

export { client }
export { producer }

function wait(ms) {

  return new Promise((resolve, reject) => {

    setTimeout(resolve, ms);

  });

}


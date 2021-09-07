#!/usr/bin/env ts-node

import { kafka, producer, consumer, admin } from '../lib/kafka'

import * as program from 'commander';

program
  .command('createtopic <topic>')
  .action(async (topic) => {


    await admin.connect()

    console.log('kafka.admin.connected')

    let topics = await admin.createTopics({
      topics: [{
        topic,
        numPartitions: 3,
        replicationFactor: 3
      }]
    })

    console.log('topics.created', topics)

  })


program
  .command('connect')
  .action(async () => {

    try {

    await producer.connect()

    console.log('kafka.producer.connected')

    var i = 0

    setInterval(async () => {

      console.log("producer send", i)

      await producer.send({
        topic: 'test-topic',
        messages: [
          { value: `Hello KafkaJS user ${i}` },
        ],
      })

      console.log("producer sent", )

      i++

    }, 1000)

    // Consuming
    await consumer.connect()
    console.log('kafka.consumer.connected')
    await consumer.subscribe({ topic: 'test-topic' })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          partition,
          offset: message.offset,
          value: message.value.toString(),
        })
      },
    })

    } catch(error) {

      console.log(error)

    }

  })


program.parse(process.argv)


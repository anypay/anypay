require('dotenv').config()

const { Kafka } = require('kafkajs')

const { KAFKA_USERNAME: username, KAFKA_PASSWORD: password } = process.env
const sasl = username && password ? { username, password, mechanism: 'plain' } : null
const ssl = !!sasl

const brokers = process.env.KAFKA_BROKERS.split(",")

// This creates a client instance that is configured to connect to the Kafka broker provided by
// the environment variable KAFKA_BOOTSTRAP_SERVER
const kafka = new Kafka({
  clientId: 'anypay',
  brokers: brokers,
  ssl: false,
  sasl: {
    mechanism: 'SCRAM-SHA-256',
    username,
    password
  }
})

const producer = kafka.producer()

const consumer = kafka.consumer({ groupId: 'anypay-1' })

const admin = kafka.admin()

export { kafka, producer, consumer, admin }


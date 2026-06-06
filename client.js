const { Kafka } = require('kafkajs')

exports.kafka = new Kafka({
    clientId: 'client-kafka',
    brokers: ["localhost:9092"]
})
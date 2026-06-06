const { Partitioners } = require('kafkajs')
const { kafka } = require('./client')
const readline = require("readline")
const crypto = require('crypto')
const { createInterface } = require('node:readline/promises');


(async () => {
    const rl = createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    const producer = kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner
    })

    await producer.connect()

    const answer = await rl.question("Ingrese el mensaje a enviar: ") //   1|hola mundo
    const [partitionNumber, message] = answer.split("|")

    await producer.send({
        topic: "test-topic",
        messages: [
            { key: crypto.randomUUID(), value: JSON.stringify({ partitionNumber, message }), partition: parseInt(partitionNumber) }
        ]
    })

    await producer.disconnect()
})()
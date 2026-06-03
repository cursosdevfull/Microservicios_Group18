const amqp = require("amqplib");

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queueName = "MyQueue";
    await channel.assertQueue(queueName, { durable: true });

    function consumeMessage(msg) {
        console.log(msg.content.toString())
    }

    channel.consume(queueName, consumeMessage, { noAck: true })
})()
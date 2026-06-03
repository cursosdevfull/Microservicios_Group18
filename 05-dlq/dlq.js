const amqp = require("amqplib");

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeDlq = "exchange-dlq";
    await channel.assertExchange(exchangeDlq, "direct", { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });
    await channel.bindQueue(q.queue, exchangeDlq, "")

    function receiveMessage(msg) {
        console.log(`Received message: ${msg.content.toString()}`);
        channel.ack(msg);
    }

    channel.consume(q.queue, receiveMessage, { noAck: false })
})()
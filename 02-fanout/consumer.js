const amqp = require("amqplib");

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeName = "exchange-fanout";
    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });

    await channel.bindQueue(q.queue, exchangeName, "")

    function consumeMessage(msg) {
        console.log(msg.content.toString())
    }

    channel.consume(q.queue, consumeMessage, { noAck: true })
})()
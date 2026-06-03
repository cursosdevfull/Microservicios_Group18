const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeName = "exchange-topic";
    await channel.assertExchange(exchangeName, "topic", { durable: true });

    const q = await channel.assertQueue("", { exclusive: true });

    const bindingKey = args.length > 0 ? args[0] : "info";

    await channel.bindQueue(q.queue, exchangeName, bindingKey)

    function consumeMessage(msg) {
        console.log(msg.content.toString())
        channel.ack(msg)
    }

    channel.consume(q.queue, consumeMessage, { noAck: false })
})()
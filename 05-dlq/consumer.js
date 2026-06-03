const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeName = "exchange-direct";
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    const exchangeDLQ = "exchange-dlq";
    await channel.assertExchange(exchangeDLQ, "direct", { durable: true });

    const q = await channel.assertQueue("", {
        exclusive: false,
        deadLetterExchange: exchangeDLQ,
        deadLetterRoutingKey: ""
    });

    const bindingKey = args.length > 0 ? args[0] : "info";

    await channel.bindQueue(q.queue, exchangeName, bindingKey)

    function consumeMessage(msg) {
        const message = msg.content.toString();
        console.log(`Received message: ${message}`);

        if (message === "hola") {
            channel.ack(msg, false);
        } else {
            //channel.reject(msg, true);
            channel.nack(msg, false, false);
        }
    }

    channel.consume(q.queue, consumeMessage, { noAck: false })
})()
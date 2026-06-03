const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeName = "exchange-direct";
    await channel.assertExchange(exchangeName, "direct", { durable: true });

    const message = args.length > 0 ? args[0] : "Hello World!";
    const bindingKey = args.length > 1 ? args[1] : "info";

    channel.publish(exchangeName, bindingKey, Buffer.from(message), { persistent: true });

    await channel.waitForConfirms();

    setTimeout(() => {
        connection.close();
        process.exit(1);
    }, 5000)
})()
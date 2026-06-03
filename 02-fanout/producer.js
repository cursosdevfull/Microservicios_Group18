const amqp = require("amqplib");
const args = process.argv.slice(2);

(async () => {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createConfirmChannel();

    const exchangeName = "exchange-fanout";
    await channel.assertExchange(exchangeName, "fanout", { durable: true });

    const message = args.length > 0 ? args[0] : "Hello World!";
    channel.publish(exchangeName, "", Buffer.from(message), { persistent: true });

    await channel.waitForConfirms();

    setTimeout(() => {
        connection.close();
        process.exit(1);
    }, 5000)
})()
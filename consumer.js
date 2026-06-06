const { kafka } = require("./client");
const groupId = process.argv[2] || "consumer-group";

(async () => {
    const consumer = kafka.consumer({ groupId });
    await consumer.connect();

    await consumer.subscribe({ topics: ["test-topic"], fromBeginning: false });

    await consumer.run({
        eachMessage: ({ topic, partition, message }) => {
            console.log("Received message:", {
                groupId,
                topic,
                partition,
                offset: message.offset,
                value: message.value.toString(),
            });
        }
    })
})()
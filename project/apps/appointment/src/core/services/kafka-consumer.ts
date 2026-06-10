import { KafkaConfig } from "./kafka-config";

export class KafkaConsumer {
    private readonly kafkaConfig: KafkaConfig

    constructor() {
        this.kafkaConfig = new KafkaConfig()
    }

    public async consume(groupId: string, topic: string, callback: (message: any) => Promise<void>) {
        const consumer = this.kafkaConfig.getConsumer(groupId)
        await consumer.connect()
        await consumer.subscribe({ topic, fromBeginning: true })
        await consumer.run({
            eachMessage: async (payload) => {
                const message = payload.message.value?.toString()
                if (message) {
                    await callback(JSON.parse(message))
                }
            }
        })
    }
}
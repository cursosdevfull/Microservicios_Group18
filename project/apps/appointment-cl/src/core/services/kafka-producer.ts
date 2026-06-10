import { KafkaConfig } from "./kafka-config";
import crypto from "crypto"

export class KafkaProducer {
    private readonly kafkaConfig: KafkaConfig

    constructor() {
        this.kafkaConfig = new KafkaConfig()
    }

    public async send(topic: string, messages: any[]) {
        const key = crypto.randomUUID()
        const producer = this.kafkaConfig.getProducer()
        await producer.connect()
        await producer.send({ topic, messages: messages.map(m => ({ key, value: JSON.stringify(m) })) })
        await producer.disconnect()
    }
}
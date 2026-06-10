import { env } from "@core/environment"
import { KafkaTopic } from "@core/types"
import { Consumer, Kafka, Partitioners, Producer } from "kafkajs"

export class KafkaConfig {
    private readonly kafka: Kafka

    constructor() {
        this.kafka = new Kafka({
            clientId: env.CLIENT_ID,
            brokers: [env.BROKER]
        })

        const topicsToCreate = env.TOPIC_NAMES.split(",").map(name => ({ name, partitions: 1, replicationFactor: 1 }))
        this.createTopics(topicsToCreate)
    }

    private async createTopics(topicList: KafkaTopic[]) {
        const topics = topicList.map(topic => ({
            topic: topic.name,
            numPartitions: topic.partitions,
            replicationFactor: topic.replicationFactor
        }))

        const admin = this.kafka.admin()
        await admin.connect()
        const topicsExisting = await admin.listTopics()
        const topicsToCreate = topics.filter(topic => !topicsExisting.includes(topic.topic))

        await admin.createTopics({ topics: topicsToCreate })
        await admin.disconnect()
    }

    public getProducer(): Producer {
        return this.kafka.producer({
            createPartitioner: Partitioners.DefaultPartitioner
        })
    }

    public getConsumer(groupId: string): Consumer {
        return this.kafka.consumer({ groupId })
    }
}

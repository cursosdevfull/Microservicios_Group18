import { ChannelModel, ConfirmChannel, connect } from "amqplib";
import { env } from "../environment";
import { ExchangeType } from "@core/types";

export interface IOptions {
    durable?: boolean;
    deadLetterExchange?: string;
    deadLetterRoutingKey?: string;
}

export class RabbimqConsumer {
    private connection: ChannelModel | null
    private channel: ConfirmChannel | null
    private exchangeName: string
    private exchangeType: ExchangeType | null
    private exchangeNameDLQ: string
    private exchangeTypeDLQ: ExchangeType | null

    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchangeName = '';
        this.exchangeType = null;
        this.exchangeNameDLQ = '';
        this.exchangeTypeDLQ = null;
    }

    public async connect(): Promise<void> {
        this.connection = await connect(env.RABBITMQ_URL);
        this.channel = await this.connection.createConfirmChannel();
    }

    public async configureExchange(exchangeName: string, exchangeType: ExchangeType, exchangeNameDLQ: string, exchangeTypeDLQ: ExchangeType): Promise<void> {
        this.exchangeName = exchangeName;
        this.exchangeType = exchangeType;
        this.exchangeNameDLQ = exchangeNameDLQ;
        this.exchangeTypeDLQ = exchangeTypeDLQ;
        await this.channel?.assertExchange(this.exchangeName, this.exchangeType, { durable: true });
        await this.channel?.assertExchange(this.exchangeNameDLQ, this.exchangeTypeDLQ, { durable: true });
    }

    public async configureQueue(queueName: string, routingKey: string, options: IOptions): Promise<void> {
        await this.channel?.assertQueue(queueName, options);
        await this.channel?.bindQueue(queueName, this.exchangeName, routingKey);
    }

    public async consumer(queueName: string, consume: (message: any) => void): Promise<void> {
        this.channel?.consume(queueName, (message) => {
            //console.error("Error processing message:", error);
            if (message !== null) {
                this.channel?.nack(message, false, false);
            }
            /*             if (message !== null) {
                            try {
                                const content = message.content.toString();
                                consume(content);
                                this.channel?.ack(message);
                            } catch (error) {
                                console.error("Error processing message:", error);
                                this.channel?.nack(message, false, false);
                            }
                        } */
        })
    }


    public async close(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }
}
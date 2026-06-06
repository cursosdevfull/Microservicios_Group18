import { ChannelModel, ConfirmChannel, connect } from "amqplib";
import { env } from "../environment";
import { ExchangeType } from "@core/types";

export class RabbimqProducer {
    private connection: ChannelModel | null
    private channel: ConfirmChannel | null
    private exchangeName: string
    private exchangeType: ExchangeType | null

    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchangeName = '';
        this.exchangeType = null;
    }

    public async connect(): Promise<void> {
        this.connection = await connect(env.RABBITMQ_URL);
        this.channel = await this.connection.createConfirmChannel();
    }

    public async configureExchange(exchangeName: string, exchangeType: ExchangeType): Promise<void> {
        this.exchangeName = exchangeName;
        this.exchangeType = exchangeType;
        await this.channel?.assertExchange(this.exchangeName, this.exchangeType, { durable: true });
    }

    public async publish(routingKey: string, message: Record<string, any>): Promise<void> {
        this.channel?.publish(this.exchangeName, routingKey, Buffer.from(JSON.stringify(message)), { persistent: true });
        await this.channel?.waitForConfirms();
    }

    public async close(): Promise<void> {
        await this.channel?.close();
        await this.connection?.close();
    }
}
import { MessageType } from '../types/kafka.types';
import { handleProductCreated } from 'kafka/handler/product-created.handler';

export class KafkaMessageHandler {
    static async handle(msg: MessageType): Promise<void> {
        const { event } = msg;

        const strategy: Record<string, (msg: MessageType) => Promise<void>> = {
            'product.created': handleProductCreated,
        };

        const handler = strategy[event];
        if (!handler) {
            console.warn(`[Kafka] No handler for event: ${event}`);
            return;
        }

        await handler(msg);
    }
}

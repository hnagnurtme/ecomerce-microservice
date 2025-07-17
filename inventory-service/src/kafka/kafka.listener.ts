import { KafkaConsumer } from './broker/kafka.consumer';
import { KafkaMessageHandler } from './strategies/kafka.strategy';

export async function startKafkaListener() {
    await KafkaConsumer.connectConsumer();

    const topics: string[] = ['product.created', 'order.created'];
    for (const topic of topics) {
        await KafkaConsumer.subscribe(KafkaMessageHandler.handle, topic as any);
    }
}

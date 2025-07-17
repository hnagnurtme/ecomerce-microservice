import { Kafka, Consumer, EachMessagePayload } from 'kafkajs';
import { kafkaConsumer } from 'kafka/kafkaClient';
export class KafkaConsumer {
    static async connectConsumer(
        groupId: string,
        topic: string,
        messageHandler: (msg: any) => Promise<void>,
    ) {
        await kafkaConsumer.subscribe({ topic, fromBeginning: true });
        console.log(`[KafkaConsumer] Subscribed to topic: ${topic}`);

        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }: EachMessagePayload) => {
                try {
                    const msgValue = message.value?.toString() || '';
                    console.log(`[KafkaConsumer] Received message on topic ${topic}:`, msgValue);

                    const parsed = JSON.parse(msgValue);
                    await messageHandler(parsed);
                } catch (error) {
                    console.error('[KafkaConsumer] Error processing message:', error);
                }
            },
        });
    }
}

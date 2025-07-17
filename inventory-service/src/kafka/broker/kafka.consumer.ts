import { kafka } from './kafka.client';
import { KafkaMessageHandler } from 'kafka/strategies/kafka.strategy';
import { MessageType, TOPIC_TYPE } from '../types/kafka.types';

const consumer = kafka.consumer({ groupId: 'my-group' });

export const KafkaConsumer = {
    async connectConsumer() {
        await consumer.connect();
        console.log('Kafka Consumer connected');
    },

    async disconnectConsumer() {
        await consumer.disconnect();
    },

    async subscribe(handler: (msg: MessageType) => void, topic: TOPIC_TYPE) {
        await consumer.subscribe({ topic, fromBeginning: true });

        await consumer.run({
            eachMessage: async ({ message }) => {
                if (!message.value) return;

                const parsed: MessageType = JSON.parse(message.value.toString());
                await handler(parsed);
            },
        });
    },
};

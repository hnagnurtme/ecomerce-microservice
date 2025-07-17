import { kafka } from './kafka.client';
import { PublishType } from 'kafka/types/kafka.types';

const producer = kafka.producer();

export const KafkaProducer = {
    async connectProducer() {
        await producer.connect();
        console.log('Kafka Producer connected');
    },

    async disconnectProducer() {
        await producer.disconnect();
    },

    async publish({ topic, message }: PublishType): Promise<boolean> {
        await producer.send({
            topic,
            messages: [{ value: JSON.stringify(message) }],
        });
        return true;
    },
};

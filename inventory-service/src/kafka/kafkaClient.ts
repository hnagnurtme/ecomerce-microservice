import { Kafka, Partitioners } from 'kafkajs';
import logger from 'utils/logger';

const kafka = new Kafka({
    clientId: 'inventory-service',
    brokers: process.env.KAFKA_BROKERS?.split(',') || ['localhost:9092'],
});

export const kafkaProducer = kafka.producer({
    createPartitioner: Partitioners.LegacyPartitioner,
});

export const kafkaConsumer = kafka.consumer({ groupId: 'inventory-consumer-group' });

export const initKafka = async () => {
    await kafkaProducer.connect();
    await kafkaConsumer.connect();
    logger.info('Kafka producer and consumer connected');
};

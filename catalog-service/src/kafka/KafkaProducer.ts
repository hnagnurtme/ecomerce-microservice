import logger from 'utils/logger';
import { PublishType } from './kafka.type';
import { kafkaProducer } from 'kafka/kafkaClient';

export class KafkaProducer {
    static async publish({ topic, event, data }: PublishType): Promise<boolean> {
        try {
            await kafkaProducer.send({
                topic,
                messages: [
                    {
                        value: JSON.stringify({ event, data }),
                    },
                ],
            });
            logger.info(
                `[Kafka] Message sent to topic ${topic} with data: ${JSON.stringify(data)}`,
            );
            return true;
        } catch (error) {
            logger.error('[Kafka] Publish error:', error);
            return false;
        }
    }
}

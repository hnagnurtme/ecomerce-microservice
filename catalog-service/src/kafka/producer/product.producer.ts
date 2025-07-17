import { KAFKA_TOPICS } from 'config';
import { log } from 'console';
import { KafkaCreatePayload } from 'dtos';
import { kafkaProducer } from 'kafka/kafkaClient';

const KEY_PRODUCT_CREATED = 'product.created';

export class ProductProducer {
    static publishProductCreated = async (payload: KafkaCreatePayload) => {
        try {
            log('Publishing user registration event:', payload);
            await kafkaProducer.send({
                topic: KAFKA_TOPICS.PRODUCT_CREATED,
                messages: [
                    {
                        key: KEY_PRODUCT_CREATED,
                        value: JSON.stringify(payload),
                    },
                ],
            });
        } catch (error) {
            console.error('Error publishing user registration event:', error);
            throw new Error('Failed to publish user registration event');
        }
    };
}

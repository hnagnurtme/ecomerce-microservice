import { KAFKA_TOPICS } from 'config';
import { log } from 'console';
import { kafkaProducer } from 'kafka/kafkaClient';
import { UserRegisterKakfaPayload } from 'dtos/kafka-payload.dto';
const KEY_CREATED = 'created';

export const publishCreatUserEvent = async (payload: UserRegisterKakfaPayload) => {
    try {
        log('Publishing user registration event:', payload);
        await kafkaProducer.send({
            topic: KAFKA_TOPICS.USER_CREATED,
            messages: [
                {
                    key: KEY_CREATED,
                    value: JSON.stringify(payload),
                },
            ],
        });
    } catch (error) {
        console.error('Error publishing user creation event:', error);
        throw new Error('Failed to publish user creation event');
    }
};

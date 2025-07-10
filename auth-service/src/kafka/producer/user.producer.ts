import { KAFKA_TOPICS } from 'config';
import { log } from 'console';
import { RegisterKafkaPayload } from 'dtos';
import { kafkaProducer } from 'kafka/kafkaClient';

const KEY_REGISTER = 'register';

export const publishUserRegisterEvent = async (
  payload: RegisterKafkaPayload
) => {
  try {
    log('Publishing user registration event:', payload);
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.USER_REGISTERED,
      messages: [
        {
          key: KEY_REGISTER,
          value: JSON.stringify(payload),
        },
      ],
    });
  } catch (error) {
    console.error('Error publishing user registration event:', error);
    throw new Error('Failed to publish user registration event');
  }
};

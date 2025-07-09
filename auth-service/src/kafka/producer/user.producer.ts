import { KAFKA_TOPICS } from 'config';
import { log } from 'console';
import { RegisterDto } from 'dtos';
import { kafkaProducer } from 'kafka/kafkaClient';

export const publishUserRegisterEvent = async (payload: RegisterDto) => {
  try {
    log('Publishing user registration event:', payload);
    await kafkaProducer.send({
      topic: KAFKA_TOPICS.USER_REGISTERED,
      messages: [
        {
          key: 'register',
          value: JSON.stringify(payload),
        },
      ],
    });
  } catch (error) {
    console.error('Error publishing user registration event:', error);
    throw new Error('Failed to publish user registration event');
  }
};

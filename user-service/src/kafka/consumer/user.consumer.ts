import { KAFKA_TOPICS } from 'config';
import { kafkaConsumer } from 'kafka/kafkaClient';
import { RegisterDto, RegisterKafkaPayload } from 'dtos';
import { UserService } from 'services';
import { mapRegisterPayloadToDto } from 'mapper';
import logger from 'utils/logger';
export const listenUserCreated = async () => {
    await kafkaConsumer.subscribe({
        topic: KAFKA_TOPICS.USER_REGISTERED,
        fromBeginning: false,
    });

    const userSerivice = new UserService();

    await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) {
                logger.error('Received message without value');
                return;
            }
            const payload: RegisterKafkaPayload = JSON.parse(message.value.toString());

            try {
                const user = await userSerivice.creatUser(
                    mapRegisterPayloadToDto(payload) as RegisterDto,
                );
                logger.info('User created successfully', { user });
            } catch (error) {
                logger.error('Error creating user from Kafka message:', error);
            }
        },
    });
};

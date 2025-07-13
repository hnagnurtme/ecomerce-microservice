import { KAFKA_TOPICS } from 'config';
import { kafkaConsumer } from 'kafka/kafkaClient';

export const listenUserCreated = async () => {
    await kafkaConsumer.subscribe({
        topic: KAFKA_TOPICS.USER_CREATED,
        fromBeginning: false,
    });

    await kafkaConsumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (!message.value) {
                console.error('Received message with null value');
                return;
            }
            const { userId, email } = JSON.parse(message.value.toString());

            console.log(`✔️ Created token for user: ${email}`);
        },
    });
};

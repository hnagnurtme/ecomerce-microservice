import { KAFKA_TOPICS } from 'config';
import { kafkaConsumer } from 'kafka/kafkaClient';
import { KafkaConfig } from 'kafkajs';
import { KeyTokenService } from 'services/key-token.service';

export const listenUserCreated = async () => {
  await kafkaConsumer.subscribe({
    topic: KAFKA_TOPICS.USER_REGISTERED,
    fromBeginning: false,
  });

  await kafkaConsumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (!message.value) {
        console.error('Received message with null value');
        return;
      }
      const { userId, email } = JSON.parse(message.value.toString());

      // Gọi tạo key-token tương ứng
      //await KeyTokenService.createTokenForUser(userId);

      console.log(`✔️ Created token for user: ${email}`);
    },
  });
};

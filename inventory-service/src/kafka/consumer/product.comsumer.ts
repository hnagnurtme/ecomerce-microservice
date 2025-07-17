import { KAFKA_TOPICS } from 'config';
import { KafkaCreatePayload } from 'dtos';
import { kafkaConsumer } from 'kafka/kafkaClient';
import logger from 'utils/logger';
import { InventoryService } from 'services';
export class ProductConsumer {
    private static inventoryService: InventoryService;

    static initialize(inventoryService: InventoryService) {
        this.inventoryService = inventoryService;
        logger.info('ProductConsumer initialized');
    }

    static async listenCreatedProduct() {
        await kafkaConsumer.subscribe({
            topic: KAFKA_TOPICS.PRODUCT_CREATED,
            fromBeginning: false,
        });

        await kafkaConsumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                if (!message.value) {
                    console.error('Received message with null value');
                    return;
                }
                const payload: KafkaCreatePayload = JSON.parse(message.value.toString());
                const addStockRequest = {
                    productId: payload.productId,
                    shopId: payload.shopId,
                    stock: payload.stock,
                    location: payload.location,
                };
                await this.inventoryService.addStockToInventory(addStockRequest);
                logger.info(`Processed message from topic ${topic} with partition ${partition}`);
            },
        });
    }
}

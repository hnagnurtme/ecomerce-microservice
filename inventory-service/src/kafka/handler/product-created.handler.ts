import { MessageType } from 'kafka/types/kafka.types';

export async function handleProductCreated(msg: MessageType) {
    console.log('[Handler] Handling product.created:', msg.data);
}

export interface MessageType {
    headers?: Record<string, any>;
    event: string;
    data: Record<string, any>;
}

export type MessageHandler = (msg: MessageType) => Promise<void>;

export interface PublishType {
    topic: string;
    message: MessageType;
}

export type TOPIC_TYPE = 'product.created';

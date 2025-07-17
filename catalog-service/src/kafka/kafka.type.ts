export type PublishType = {
    topic: string;
    event: string;
    data: Record<string, any>;
};

export interface MessageType {
    event: string;
    data: Record<string, any>;
    headers?: Record<string, any>;
}

import { KafkaCreatePayload } from 'dtos';
import { IProduct } from 'models';
import { convertToObjectId } from 'utils';

export const mapIProductCreatedToKafkaPayload = (productCreated: IProduct): KafkaCreatePayload => {
    return {
        productId: (productCreated._id as string | number).toString(),
        shopId: productCreated.productShop.toString(),
        stock: productCreated.productQuantity,
        location: productCreated.productAttributes?.location || undefined,
    };
};

export const mapKafkaPayloadToIProduct = (payload: KafkaCreatePayload): Partial<IProduct> => {
    return {
        _id: payload.productId,
        productShop: convertToObjectId(payload.shopId),
        productQuantity: payload.stock,
        productAttributes: {
            location: payload.location || '',
        },
    };
};

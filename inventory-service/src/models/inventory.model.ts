import { model, Types, Schema, Document } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Inventory';
const COLLECTION_NAME = 'Inventories';

export interface IInventory extends Document {
    productId: Types.ObjectId;
    location: string;
    inventReservation: any[];
    stock: number;
    shopId: Types.ObjectId;
}
export const inventorySchema = new Schema<IInventory>(
    {
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        location: { type: String, required: true, trim: true, maxLength: 200 },
        inventReservation: { type: Schema.Types.Mixed, default: [] },
        stock: { type: Number, required: true, min: 0 },
        shopId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export const Inventory = model<IInventory>(DOCUMENT_NAME, inventorySchema);

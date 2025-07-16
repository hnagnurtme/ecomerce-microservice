import { model, Schema, Types, Document } from 'mongoose';

const DOCUMENT_NAME = 'Clothing';
const COLLECTION_NAME = 'Clothings';

export interface IClothing extends Document {
    brand: string;
    size?: string;
    material?: string;
    productShop: Types.ObjectId;
}

const clothingSchema = new Schema<IClothing>(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        productShop: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export default model<IClothing>(DOCUMENT_NAME, clothingSchema);

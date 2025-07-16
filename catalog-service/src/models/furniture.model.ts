import { model, Schema, Types, Document } from 'mongoose';

const DOCUMENT_NAME = 'Furniture';
const COLLECTION_NAME = 'Furnitures';

export interface IFurniture extends Document {
    brand: string;
    size?: string;
    material?: string;
    productShop: Types.ObjectId;
}

const furnitureSchema = new Schema<IFurniture>(
    {
        brand: { type: String, required: true },
        size: String,
        material: String,
        productShop: { type: Schema.Types.ObjectId, ref: 'Shop', required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export default model<IFurniture>(DOCUMENT_NAME, furnitureSchema);

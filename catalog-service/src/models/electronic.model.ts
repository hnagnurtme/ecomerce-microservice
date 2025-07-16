import { model, Schema, Types, Document } from 'mongoose';

const DOCUMENT_NAME = 'Electronic';
const COLLECTION_NAME = 'Electronics';

export interface IElectronic extends Document {
    manufacturer: string;
    modelName?: string;
    color?: string;
    productShop: Types.ObjectId;
}

const electronicSchema = new Schema<IElectronic>(
    {
        manufacturer: { type: String, required: true },
        modelName: String,
        color: String,
        productShop: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export default model<IElectronic>(DOCUMENT_NAME, electronicSchema);

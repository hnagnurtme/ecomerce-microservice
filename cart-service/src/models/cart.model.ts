import { model, Types, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'Cart';
const COLLECTION_NAME = 'Carts';

export interface ICart extends Document {
    userId: Types.ObjectId;
    products: {
        productId: Types.ObjectId;
        quantity: number;
        price: number;
    }[];
    totalPrice: number;
    state: 'active' | 'completed' | 'failed' | 'pending';
}

export const cartSchema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true, min: 0 },
            },
        ],
        totalPrice: { type: Number, required: true, min: 0 },
        state: {
            type: String,
            required: true,
            enum: ['active', 'completed', 'failed', 'pending'],
            default: 'active',
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export const Cart = model<ICart>(DOCUMENT_NAME, cartSchema);

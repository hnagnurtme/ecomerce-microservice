import { model, Types, Schema, Document } from 'mongoose';
import slugify from 'slugify';

const DOCUMENT_NAME = 'Product';
const COLLECTION_NAME = 'Products';

const PRODUCT_TYPES = ['Clothing', 'Electronic', 'Furniture'] as const;
export interface ProductVariation {
    size?: string;
    color?: string;
    stock: number;
    priceDiff?: number;
}

export interface IProduct extends Document {
    productName: string;
    productThumb: string;
    productDescription?: string;
    productSlug: string;
    productPrice: number;
    productQuantity: number;
    productType: (typeof PRODUCT_TYPES)[number];
    productShop: Types.ObjectId;
    productAttributes: Record<string, any>;
    productRatingsAverage: number;
    productVariations: ProductVariation[];
    isDraft: boolean;
    isPublished: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

const variationSchema = new Schema<ProductVariation>(
    {
        size: String,
        color: String,
        stock: { type: Number, required: true },
        priceDiff: Number,
    },
    { _id: false },
);

const productSchema = new Schema<IProduct>(
    {
        productName: { type: String, required: true, trim: true, maxLength: 200 },
        productThumb: { type: String, required: true },
        productDescription: { type: String },
        productSlug: { type: String },
        productPrice: { type: Number, required: true },
        productQuantity: { type: Number, required: true },
        productType: {
            type: String,
            required: true,
            enum: ['Clothing', 'Electronic', 'Furniture'],
        },
        productShop: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        productAttributes: { type: Schema.Types.Mixed, required: true },
        productRatingsAverage: {
            type: Number,
            default: 4.5,
            min: 0,
            max: 5,
            set: (val: number) => Math.round(val * 10) / 10,
        },
        productVariations: {
            type: [variationSchema],
            default: [],
        },
        isDraft: { type: Boolean, default: true, index: true, select: false },
        isPublished: { type: Boolean, default: false, index: true, select: false },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

productSchema.index({ productName: 'text', productDescription: 'text' });

productSchema.pre('save', function (next) {
    this.productSlug = slugify(this.productName, { lower: true });
    next();
});

export default model<IProduct>(DOCUMENT_NAME, productSchema);

import { model, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'Users';

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    roles: string[];
}

const userSchema = new Schema<IUser>(
    {
        name: {
            type: String,
            trim: true,
            maxLength: 150,
        },
        email: {
            type: String,
            unique: true,
            maxLength: 150,
        },
        password: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['active', 'inactive'],
            default: 'inactive',
        },
        verify: {
            type: Schema.Types.Boolean,
            default: false,
        },
        roles: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        collection: COLLECTION_NAME,
    },
);

export default model<IUser>(DOCUMENT_NAME, userSchema);

import { model, Types, Schema, Document } from 'mongoose';

const DOCUMENT_NAME = 'Key';
const COLLECTION_NAME = 'Keys';

export interface IKeyToken extends Document {
  user: Types.ObjectId;
  publicKey: string;
  privateKey: string;
  refreshTokenUsed: string[];
  refreshToken: string;
}

const keyTokenSchema = new Schema<IKeyToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    publicKey: {
      type: String,
      required: true,
    },
    privateKey: {
      type: String,
      required: true,
    },
    refreshTokenUsed: {
      type: [String],
      default: [],
    },
    refreshToken: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME,
  }
);

export default model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);

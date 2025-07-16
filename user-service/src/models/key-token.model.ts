import { Types } from 'mongoose';

export interface IKeyToken {
    _id?: Types.ObjectId;
    user: Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokenUsed: string[];
    refreshToken: string;
}

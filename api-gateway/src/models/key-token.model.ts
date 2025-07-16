import { Types } from 'mongoose';

export interface IKeyToken {
    user: Types.ObjectId;
    publicKey: string;
    privateKey: string;
    refreshTokenUsed: string[];
    refreshToken: string;
}

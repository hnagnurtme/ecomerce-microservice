import KeyModel, { IKeyToken } from 'models/key-token.model';

export class KeyTokenRepository {
    async findByUserId(userId: string): Promise<IKeyToken | null> {
        return await KeyModel.findOne({ userId });
    }

    async create(keyTokenData: Partial<IKeyToken>): Promise<IKeyToken> {
        return await KeyModel.create(keyTokenData);
    }

    async deleteByUserId(userId: string): Promise<void> {
        await KeyModel.deleteMany({ userId });
    }
}
export default new KeyTokenRepository();

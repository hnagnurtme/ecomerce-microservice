import KeyModel, { IKeyToken } from 'models/key-token.model';
import { convertToObjectId } from 'utils/pick';
export class KeyTokenRepository {
    async findByUserId(userId: string): Promise<IKeyToken | null> {
        return await KeyModel.findOne({ user: convertToObjectId(userId) }).lean();
    }
}
export default new KeyTokenRepository();

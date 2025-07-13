import UserModel, { IUser } from '../models/user.model';

export class UserRepository {
    async existsByEmail(email: string): Promise<boolean> {
        return await UserModel.exists({ email }).then((result) => !!result);
    }
    async findByEmail(email: string): Promise<IUser | null> {
        return await UserModel.findOne({ email }).lean();
    }
}

export default new UserRepository();

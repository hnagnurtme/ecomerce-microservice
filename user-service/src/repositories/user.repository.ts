import UserModel, { IUser } from '../models/user.model';

export class UserRepository {
    async existsByEmail(email: string): Promise<boolean> {
        return await UserModel.exists({ email }).then((result) => !!result);
    }

    async createUser(userData: IUser): Promise<IUser> {
        const newUser = UserModel.create(userData);
        return newUser;
    }

    async getUserById(userId: string): Promise<IUser | null> {
        if (!userId) {
            throw new Error('User ID is required');
        }
        return await UserModel.findById(userId).lean().exec();
    }

    async getUserByEmail(email: string): Promise<IUser | null> {
        if (!email) {
            throw new Error('Email is required');
        }
        return await UserModel.findOne({ email }).lean().exec();
    }
}

export default new UserRepository();

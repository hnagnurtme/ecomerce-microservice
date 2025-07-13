import UserModel, { IUser } from '../models/user.model';

export class UserRepository {
    async existsByEmail(email: string): Promise<boolean> {
        return await UserModel.exists({ email }).then((result) => !!result);
    }

    async createUser(userData: IUser): Promise<any> {
        const newUser = UserModel.create(userData);
        return newUser;
    }
}

export default new UserRepository();

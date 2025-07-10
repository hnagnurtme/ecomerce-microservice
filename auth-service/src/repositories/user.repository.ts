import UserModel, { IUser } from '../models/user.model';

export class UserRepository {
  async existsByEmail(email: string): Promise<boolean> {
    return await UserModel.exists({ email }).then(result => !!result);
  }
}

export default new UserRepository();

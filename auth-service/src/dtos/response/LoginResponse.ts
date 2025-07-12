import { IKeyToken } from 'models/key-token.model';
import { IUser } from 'models/user.model';

export class LoginResponse {
  keyToken: {
    accessToken: string;
    refreshToken: string;
  };
  user: Partial<IUser>;

  constructor(accessToken: string, refreshToken: string, user: Partial<IUser>) {
    this.keyToken = {
      accessToken,
      refreshToken,
    };
    this.user = user;
  }
}

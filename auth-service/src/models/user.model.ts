export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    roles: string[];
}

export interface IUser {
    userId: number;
    email: string;
    familyName?: string;
    givenMail?: string;
}

export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserRO = Readonly<IUser>;
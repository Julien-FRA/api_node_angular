export interface IUser {
    userId: number;
    familyName?: string;
    givenName?: string;
    email: string;
    password: string;
    token: string;
}

// export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserRO = Readonly<IUser>;
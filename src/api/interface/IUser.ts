export interface IUser {
    userId: number;
    familyName?: string;
    givenName?: string;
    email: string;
}

// export type IUserCreate = Omit<IUser, 'userId'>;

export type IUserRO = Readonly<IUser>;
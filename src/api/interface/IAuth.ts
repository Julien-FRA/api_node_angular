export interface IAuth {
    email?: string;
    password?: string;
}

export type IAuthRO = Readonly<IAuth>;
export interface IMeal {
    mealId: number;
    name: string;
    type?: string;
}

// export type IUserCreate = Omit<IUser, 'userId'>;

export type IMealRO = Readonly<IMeal>;
export interface IUser {
    id: number,
    color: string,
    username: string,
}

export interface IMessage {
    fromUser: IUser,
    toUser?: any,
    message: string,
}

export interface IChat {
    id: number,
    users: Array<number>,
    name: string,
    group?: boolean,
    created: Date,
    color: string,
}
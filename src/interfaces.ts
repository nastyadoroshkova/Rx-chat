export interface IUser {
    id: string,
    color: string,
    username: string,
}

export interface IMessage {
    fromUser: IUser,
    toUser?: any,
    message: string,
}
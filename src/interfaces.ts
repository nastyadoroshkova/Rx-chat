export interface IUser {
    id: number,
    color?: string,
    username: string,
}

export interface IMessage {
    id: number,
    chatId: number,
    created: Date,
    userId: number,
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
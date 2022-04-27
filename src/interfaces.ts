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
    user?: IUser,
    message: string,
    read: boolean,
}

export interface IChat {
    id: number,
    users: Array<number>,
    name: string,
    group?: boolean,
    created: Date,
    color?: string,
    lastMessage: IMessage,
}

export interface IChatCash {
    id: number,
    history: Array<IMessage>
}
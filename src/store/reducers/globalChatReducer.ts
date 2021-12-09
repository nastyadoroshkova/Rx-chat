import {
    SET_GLOBAL_CHAT_STORAGE,
    UPDATE_GLOBAL_CHAT_STORAGE
} from "../actionTypes";
import {IChat, IMessage} from "../../interfaces";
import {TreeMap} from 'jstreemap';

const initialState = {
    globalChatStorage: {} as TreeMap<IChat, Array<IMessage>>
};

export const globalChatReducer = (state = initialState, action:AppActionType) => {
    switch (action.type) {
        case SET_GLOBAL_CHAT_STORAGE:
            return { ...state, globalChatStorage: action.payload };
        case UPDATE_GLOBAL_CHAT_STORAGE:
            return { ...state, globalChatStorage: action.payload };
        default:
            return state;
    }
};

type SetGlobalChatStorage = {
    type: typeof SET_GLOBAL_CHAT_STORAGE,
    payload: TreeMap<IChat, Array<IMessage>>
}

type UpdateGlobalChatStorage = {
    type: typeof UPDATE_GLOBAL_CHAT_STORAGE,
    payload: TreeMap<IChat, Array<IMessage>>
}

export type AppActionType = SetGlobalChatStorage | UpdateGlobalChatStorage;
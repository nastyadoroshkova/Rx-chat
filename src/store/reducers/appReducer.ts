import {
  CONNECT,
  CREATE_MESSAGE_STREAM,
  RESET_CURRENT_CHAT,
  SEARCH_USER,
  SET_CHAT_HISTORY,
  SET_CHAT_LIST,
  SET_CURRENT_CHAT, UPDATE_USER_HASH,
} from "../actionTypes";
import {ReactiveSocket} from "rsocket-types";
import {IChat, IMessage, IUser} from "../../interfaces";

const initialState = {
  rsocket: {} as ReactiveSocket<any,any>,
  subscription: {} as ReactiveSocket<any,any>,
  chats: [] as Array<IChat>,
  userSearch: [] as Array<IUser>,
  currentChat: {} as IChat,
  chatHistory: [] as Array<IMessage>,
  usersHash: [] as Array<IUser>
};

export const appReducer = (state = initialState, action:AppActionType) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case CREATE_MESSAGE_STREAM:
      return { ...state, subscription: action.payload };
    case SET_CHAT_LIST:
      return { ...state, chats: [...state.chats, action.payload] };
    case SEARCH_USER:
      return { ...state, userSearch: action.payload };
    case SET_CURRENT_CHAT:
      return { ...state, currentChat: action.payload };
    case SET_CHAT_HISTORY:
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case RESET_CURRENT_CHAT:
      return { ...state, chatHistory: [], currentChat: null };
    case UPDATE_USER_HASH:
      return { ...state, usersHash: [...state.usersHash, action.payload] };
    default:
      return state;
  }
};

type ConnectType = {
  type: typeof CONNECT,
  payload: any
}

type ConnectMessageStreamType = {
  type: typeof CREATE_MESSAGE_STREAM,
  payload: any
}

type SetChatListType = {
  type: typeof SET_CHAT_LIST,
  payload: any
}

type SearchUserType = {
  type: typeof SEARCH_USER,
  payload: Array<IUser>
}

type SetCurrentChatType = {
  type: typeof SET_CURRENT_CHAT,
  payload: IChat
}

type SetChatHistoryType = {
  type: typeof SET_CHAT_HISTORY,
  payload: IMessage
}

type ResetCurrentChat = {
  type: typeof RESET_CURRENT_CHAT,
  payload: any
}

type UpdateUserHash = {
  type: typeof UPDATE_USER_HASH,
  payload: any
}

export type AppActionType = ConnectType |
    ConnectMessageStreamType | SetChatListType | SearchUserType |
    SetCurrentChatType | SetChatHistoryType | ResetCurrentChat | UpdateUserHash;
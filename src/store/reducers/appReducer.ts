import {
  CONNECT, CREATE_MESSAGE_STREAM, SET_CHAT_LIST,
} from "../actionTypes";
import {ReactiveSocket} from "rsocket-types";
import {IChat} from "../../interfaces";

const initialState = {
  rsocket: {} as ReactiveSocket<any,any>,
  subscription: {} as ReactiveSocket<any,any>,
  chats: [] as Array<IChat>,
};

export const appReducer = (state = initialState, action:AppActionType) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case CREATE_MESSAGE_STREAM:
      return { ...state, subscription: action.payload };
    case SET_CHAT_LIST:
      return { ...state, chats: [...state.chats, action.payload] };
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

export type AppActionType = ConnectType | ConnectMessageStreamType | SetChatListType;
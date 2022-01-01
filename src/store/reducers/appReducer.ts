import {
  CONNECT,
  RESET_CURRENT_CHAT,
  SEARCH_USER,
  SET_CHAT_HISTORY,
  SET_CHAT_LIST,
  SET_CURRENT_CHAT,
  SET_GLOBAL_CHAT_STORAGE,
  UPDATE_CHAT_HISTORY,
  UPDATE_TOTAL,
  UPDATE_CHAT_CASH,
  IS_CREATE_GROUP_CHAT,
  UPDATE_LAST_MESSAGE,
} from "../actionTypes";
import {ReactiveSocket} from "rsocket-types";
import {IChat, IChatCash, IMessage, IUser} from "../../interfaces";

const initialState = {
  rsocket: {} as ReactiveSocket<any,any>,
  chats: [] as Array<IChat>,
  userSearch: [] as Array<IUser>,
  currentChat: {} as IChat,
  chatHistory: [] as Array<IMessage>,
  total: 0 as number,
  globalChatStorage: {} as Map<IChat, Array<IMessage>>,
  chatCash: {} as Array<IChatCash>,
  isCreateGroup: false as boolean,
};

export const appReducer = (state = initialState, action:AppActionType) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case SET_CHAT_LIST:
      return { ...state, chats: [...state.chats, action.payload] };
    case SEARCH_USER:
      return { ...state, userSearch: action.payload };
    case SET_CURRENT_CHAT:
      return { ...state, currentChat: action.payload };
    case SET_CHAT_HISTORY:
      return { ...state, chatHistory: [...state.chatHistory, action.payload] };
    case UPDATE_CHAT_HISTORY:
      return { ...state, chatHistory: [...action.payload, ...state.chatHistory,] };
    case RESET_CURRENT_CHAT:
      return { ...state, chatHistory: [], currentChat: null };
    case UPDATE_TOTAL:
      return { ...state, total: action.payload };
    case SET_GLOBAL_CHAT_STORAGE:
      return { ...state, globalChatStorage: action.payload };
    case IS_CREATE_GROUP_CHAT:
      return { ...state, isCreateGroup: action.payload};
    case UPDATE_LAST_MESSAGE:
      const updatedChats = state.chats.map((item) => {
        if(item.id === action.payload.chatId) {
          const newItem = {...item};
          newItem.lastMessage = action.payload;
          return newItem;
        }
        return item;
      });
      return { ...state, chats: updatedChats};
    case UPDATE_CHAT_CASH:
      const type = action.payload.type;
      const messages = action.payload.data;
      if(messages.length) {
        const chatId:number = messages[0].chatId;
        return { ...state,
          chatCash: {
            ...state.chatCash,
            // @ts-ignore
            [chatId]: !state.chatCash[chatId] ? messages : convertMessages(type,state.chatCash[chatId], messages )
          }
        }
      }
      return {...state}
    default:
      return state;
  }
};

const convertMessages = (type: string, stateArray: Array<IMessage>, loadedArray: Array<IMessage>) => {
  return type === 'one' ? [...stateArray, ...loadedArray] : [...loadedArray, ...stateArray];
}

type ConnectType = {
  type: typeof CONNECT,
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
  payload: any
}

type ResetCurrentChat = {
  type: typeof RESET_CURRENT_CHAT,
  payload: any
}

type UpdateChatHistory = {
  type: typeof UPDATE_CHAT_HISTORY,
  payload: any
}

type UpdateTotal = {
  type: typeof UPDATE_TOTAL,
  payload: any
}

type SetGlobalChatStorage = {
  type: typeof SET_GLOBAL_CHAT_STORAGE,
  payload: Map<IChat, Array<IMessage>>
}

type UpdateChatCash = {
  type: typeof UPDATE_CHAT_CASH,
  payload: any
}

type IsCreateGroupChat = {
  type: typeof IS_CREATE_GROUP_CHAT,
  payload: any
}

type UpdateLastMessage = {
  type: typeof UPDATE_LAST_MESSAGE,
  payload: any
}

export type AppActionType = ConnectType | SetChatListType | SearchUserType |
    SetCurrentChatType | SetChatHistoryType | ResetCurrentChat | UpdateChatHistory |
    UpdateTotal | SetGlobalChatStorage | UpdateChatCash | IsCreateGroupChat | UpdateLastMessage;
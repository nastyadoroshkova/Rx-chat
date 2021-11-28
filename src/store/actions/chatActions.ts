import {Dispatch} from "redux";

import {
    SET_CHAT_LIST,
    SET_CHAT_HISTORY,
    SET_CURRENT_CHAT,
    RESET_CURRENT_CHAT,
} from "../actionTypes";
import {getUserShortInfo} from "./userActions";
import {ActionType, AppStateType} from "../index";
import {IChat, IMessage, IUser} from "../../interfaces";

import {
    CHAT_CREATE_ROUTE,
    MESSAGE_HISTORY_ROUTE,
} from "./routes";

export const isChatExist = (chatId:number, chats: [IChat]) => {
    return !!(chats.find(item => item.id === chatId));
}

export function openCurrentChat(chat:IChat) {
    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        resetSelectedChat(dispatch);
        dispatch({type: SET_CURRENT_CHAT, payload: chat});
        getHistory(getState, dispatch, chat.id);
    }
}

const resetSelectedChat = (dispatch:Dispatch<ActionType>) => {
    dispatch({type: RESET_CURRENT_CHAT, payload: null});
}

const getHistory = (getState: () => AppStateType, dispatch:Dispatch<ActionType>, chatId:number) => {
    const limit = 10;
    const {currentChat, usersHash, rsocket}:any = getState().app;
    rsocket.simpleRequestResponse(MESSAGE_HISTORY_ROUTE, { chatId, limit })
        .subscribe((data:any) => {
            data.forEach((message:IMessage) => {
                if(message.chatId === currentChat.id) {
                    getUserShortInfo(rsocket, dispatch, usersHash, message.userId).then((result) => {
                        dispatch({type: SET_CHAT_HISTORY, payload: {...message, user: result}});
                    })
                }
            });
        });
}

export function createChatWithUser(friend:IUser) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {chats, rsocket}:any = getState().app;
    const {user} = getState().user;
    const chat = getChatInfoByUserId(friend.id, chats);
    resetSelectedChat(dispatch);

    if(!!chat) {
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
      getHistory(getState, dispatch, chat.id);
    } else {
      createChat(rsocket, friend, user).then((result:any) => {
        dispatch({type: SET_CHAT_LIST, payload: result});
        dispatch({type: SET_CURRENT_CHAT, payload: result});
      })
    }
  }
}

const getChatInfoByUserId = (userId:number, chats: [IChat]) => {
  return chats.find((item:IChat) => {
    return (!item.group && item.users.includes(userId));
  });
}

const createChat = (rsocket:any, friend:IUser, myUser:IUser) => {
  return new Promise((resolve) => {
    rsocket.simpleRequestResponse(
        CHAT_CREATE_ROUTE, { users: [friend.id, myUser.id], userId: myUser.id })
        .subscribe((result:any) => resolve(result));
  })
}
import {Dispatch} from "redux";

import {
    RESET_CURRENT_CHAT,
    SET_CHAT_LIST,
    SET_CURRENT_CHAT,
    UPDATE_CHAT_HISTORY,
    UPDATE_TOTAL, UPDATE_USER_LIST,
} from "../actionTypes";
import {ActionType, AppStateType} from "../index";
import {IChat, IMessage, IUser} from "../../interfaces";

import {CHAT_CREATE_ROUTE, MESSAGE_HISTORY_ROUTE, USER_SHORT_INFO_ROUTE,} from "./routes";
import {addAuthData} from "../authHelper";

export const isChatExist = (chatId:number, chats: [IChat]) => {
    return !!(chats.find(item => item.id === chatId));
}

export function openCurrentChat(chat:IChat) {
    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        resetSelectedChat(dispatch);
        dispatch({type: SET_CURRENT_CHAT, payload: chat});
        getHistory(getState, dispatch, chat.id, new Date());
    }
}

const resetSelectedChat = (dispatch:Dispatch<ActionType>) => {
    dispatch({type: RESET_CURRENT_CHAT, payload: null});
}

export function createChatWithUser(friend:IUser) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {chats, rsocket}:any = getState().app;
    const {user} = getState().user;
    const chat = getChatInfoByUserId(friend.id, chats);
    resetSelectedChat(dispatch);

    if(!!chat) {
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
      getHistory(getState, dispatch, chat.id, new Date());
    } else {
      createChat(rsocket, friend, user).then((result:any) => {
        dispatch({type: SET_CHAT_LIST, payload: result});
        dispatch({type: SET_CURRENT_CHAT, payload: result});
      })
    }
  }
}

export function loadHistory() {
    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        const {currentChat, chatHistory}:any = getState().app;
        const from = chatHistory[0].created;
        getHistory(getState, dispatch, currentChat.id, from);
    }
}

const getHistory = (getState: () => AppStateType, dispatch:Dispatch<ActionType>, chatId:number, from:Date) => {
    const limit = 10;
    const {rsocket}:any = getState().app;
    const {chatHistory}:any = getState().app;
    rsocket.simpleRequestResponse(MESSAGE_HISTORY_ROUTE, { chatId, from, limit })
        .subscribe((data:any) => {
            // @ts-ignore
            let messages = (chatHistory.concat(data.list)).sort((a,b)=> {return new Date(a.created) - new Date(b.created)});
            const userIds = new Set(data.list.map((item:IMessage) => item.userId));

            const {users}:any = getState().user;
            const {user}:any = getState().user;
            userIds.forEach((id) => {
                const result = users.find((item:IUser) => {return item.id === id});
                if (!result) {
                    rsocket.simpleRequestResponse(USER_SHORT_INFO_ROUTE, {userId: id}, addAuthData(user.username))
                        .subscribe((data:any) => {
                            dispatch({type: UPDATE_USER_LIST, payload: data})
                        });
                }
            })

            dispatch({type: UPDATE_CHAT_HISTORY, payload: [...messages]});
            dispatch({type: UPDATE_TOTAL, payload: data.total});
        });
}

const getChatInfoByUserId = (userId:number, chats: [IChat]) => {
  return chats.find((item:IChat) => {
    return (!item.group && item.users.includes(userId));
  });
}

const createChat = (rsocket:any, friend:IUser, myUser:IUser) => {
  return new Promise((resolve) => {
    rsocket.simpleRequestResponse(
        CHAT_CREATE_ROUTE, { users: [friend.id, myUser.id] }, addAuthData(myUser.username))
        .subscribe((result:any) => resolve(result));
  })
}
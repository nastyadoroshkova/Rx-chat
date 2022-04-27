import {Dispatch} from 'redux';

import {defaultIfEmpty, observeOn, tap} from 'rxjs/operators';

import {map, mergeMap, queueScheduler, zip} from 'rxjs';

import {
  IS_CREATE_GROUP_CHAT,
  RESET_CURRENT_CHAT,
  SET_CHAT_LIST,
  SET_CURRENT_CHAT,
  UPDATE_CHAT_CASH,
  UPDATE_CHAT_HISTORY,
  UPDATE_TOTAL,
  UPDATE_USER_LIST,
} from '../actionTypes';
import {ActionType, AppStateType} from '../index';
import {IChat, IMessage, IUser} from '../../interfaces';

import {addAuthData} from '../authHelper';

import {CHAT_CREATE_ROUTE, MESSAGE_HISTORY_ROUTE, USER_SHORT_INFO_ROUTE} from './routes';

export const isChatExist = (chatId: number, chats: [IChat]) => {
  return !!(chats.find(item => item.id === chatId));
};

export function openCurrentChat(chat?: IChat) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    resetSelectedChat(dispatch);
    if(chat?.id) {
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
      getHistory(getState, dispatch, chat.id, new Date(), () => {});
    }
  };
}

const resetSelectedChat = (dispatch: Dispatch<ActionType>) => {
  dispatch({type: RESET_CURRENT_CHAT, payload: null});
};

export function createChatWithUser(friend: IUser) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    const {chats, rsocket}: any = getState().app;
    const {user} = getState().user;
    const chat = getChatInfoByUserId(friend.id, chats);
    resetSelectedChat(dispatch);

    if (!!chat) {
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
      getHistory(getState, dispatch, chat.id, new Date(), () => {});
    } else {
      createChat(rsocket,{users: [friend.id, user.id]}, user.username).then((result: any) => {
        dispatch({type: SET_CHAT_LIST, payload: result});
        dispatch({type: SET_CURRENT_CHAT, payload: result});
      });
    }
  };
}

export function createGroupChat(groupName:string, groupUsersId:Array<number>) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket}: any = getState().app;
    const {user} = getState().user;
    const data = {
      name: groupName,
      group: true,
      users: [...groupUsersId, user.id],
    };
    resetSelectedChat(dispatch);
    createChat(rsocket,data, user.username).then((result: any) => {
      dispatch({type: SET_CHAT_LIST, payload: result});
      dispatch({type: SET_CURRENT_CHAT, payload: result});
      dispatch({type: IS_CREATE_GROUP_CHAT, payload: false});
    });
  };
}

export function loadHistory(callback: () => void) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    const {currentChat, chatHistory}: any = getState().app;
    const from = chatHistory.length ? chatHistory[0].created : null;
    getHistory(getState, dispatch, currentChat.id, from, callback);
  };
}

const getHistory = (
  getState: () => AppStateType, 
  dispatch: Dispatch<ActionType>, 
  chatId: number, 
  from: Date, 
  callback: () => void,
) => {
  const limit = 20;
  const {rsocket, chatCash, chatHistory}: any = getState().app;
  const {user, users}: any = getState().user;
  if(chatCash[chatId] && chatCash[chatId].length > chatHistory.length){
    dispatch({type: UPDATE_CHAT_HISTORY, payload: chatCash[chatId]});
  } else {
    rsocket.simpleRequestResponse(MESSAGE_HISTORY_ROUTE, {chatId, from, limit})
      .pipe(
        observeOn(queueScheduler),
        tap(({total}: any) => dispatch({type: UPDATE_TOTAL, payload: total})),
        mergeMap(({list}: any) => {
          return zip(Array.from(new Set(list.map((msg: IMessage) => msg.userId)))
            .filter(userId => !users.find((item: IUser) => item.id === userId))
            .map(
              userId => rsocket.simpleRequestResponse(USER_SHORT_INFO_ROUTE, {userId: userId}, 
                addAuthData(user.username),
              )
                .pipe(tap((user: IUser) => dispatch({type: UPDATE_USER_LIST, payload: user}))),
            ))
            .pipe(
              defaultIfEmpty([]),
              map(cached => {
                const {users}: any = getState().user;
                return list.map((msg: IMessage) => {
                  msg.user = users.find((item: IUser) => item.id === msg.userId);
                  return msg;
                },
                );
              }),
            );
        }),
      )
      .subscribe((messages: any) => {
        dispatch({type: UPDATE_CHAT_HISTORY, payload: messages});
        dispatch({type: UPDATE_CHAT_CASH, payload: { type: 'history', data: messages}});
        callback();
      });
  }
};

const getChatInfoByUserId = (userId: number, chats: [IChat]) => {
  return chats.find((item: IChat) => {
    return (!item.group && item.users.includes(userId));
  });
};

const createChat = (rsocket: any, data:any, username:string) => {
  return new Promise((resolve) => {
    rsocket.simpleRequestResponse(
      CHAT_CREATE_ROUTE, data, addAuthData(username))
      .subscribe((result: any) => resolve(result));
  });
};

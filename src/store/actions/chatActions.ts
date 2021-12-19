import {Dispatch} from "redux";

import {
    RESET_CURRENT_CHAT,
    SET_CHAT_LIST,
    SET_CURRENT_CHAT,
    UPDATE_CHAT_CASH,
    UPDATE_CHAT_HISTORY,
    UPDATE_TOTAL,
    UPDATE_USER_LIST,
} from "../actionTypes";
import {ActionType, AppStateType} from "../index";
import {IChat, IMessage, IUser} from "../../interfaces";

import {CHAT_CREATE_ROUTE, MESSAGE_HISTORY_ROUTE, USER_SHORT_INFO_ROUTE,} from "./routes";
import {addAuthData} from "../authHelper";
import {defaultIfEmpty, observeOn, tap} from "rxjs/operators";
import {map, mergeMap, queueScheduler, zip} from "rxjs";

export const isChatExist = (chatId: number, chats: [IChat]) => {
    return !!(chats.find(item => item.id === chatId));
}

export function openCurrentChat(chat: IChat) {
    return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
        resetSelectedChat(dispatch);
        dispatch({type: SET_CURRENT_CHAT, payload: chat});
        getHistory(getState, dispatch, chat.id, new Date(), () => {
        });
    }
}

const resetSelectedChat = (dispatch: Dispatch<ActionType>) => {
    dispatch({type: RESET_CURRENT_CHAT, payload: null});
}

export function createChatWithUser(friend: IUser) {
    return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
        const {chats, rsocket}: any = getState().app;
        const {user} = getState().user;
        const chat = getChatInfoByUserId(friend.id, chats);
        resetSelectedChat(dispatch);

        if (!!chat) {
            dispatch({type: SET_CURRENT_CHAT, payload: chat});
            getHistory(getState, dispatch, chat.id, new Date(), () => {
            });
        } else {
            createChat(rsocket, friend, user).then((result: any) => {
                dispatch({type: SET_CHAT_LIST, payload: result});
                dispatch({type: SET_CURRENT_CHAT, payload: result});
            })
        }
    }
}

export function loadHistory(callback: () => void) {
    return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
        const {currentChat, chatHistory}: any = getState().app;
        const from = chatHistory.length ? chatHistory[0].created : null;
        getHistory(getState, dispatch, currentChat.id, from, callback);
    }
}

const getHistory = (getState: () => AppStateType, dispatch: Dispatch<ActionType>, chatId: number, from: Date, callback: () => void) => {
    const limit = 10;
    const {rsocket, chatCash, chatHistory}: any = getState().app;
    const {user, users}: any = getState().user;
    if(chatCash[chatId] && chatCash[chatId].length > chatHistory.length){
        console.log('from CASH', 'cash:', chatCash[chatId].length, 'chatHistory:', chatHistory.length);
        dispatch({type: UPDATE_CHAT_HISTORY, payload: chatCash[chatId]});
    } else {
        console.log('from SERVER');
        rsocket.simpleRequestResponse(MESSAGE_HISTORY_ROUTE, {chatId, from, limit})
            .pipe(
                observeOn(queueScheduler),
                tap(({total}: any) => dispatch({type: UPDATE_TOTAL, payload: total})),
                mergeMap(({list}: any) => {
                    return zip(Array.from(new Set(list.map((msg: IMessage) => msg.userId)))
                        .filter(userId => !users.find((item: IUser) => item.id === userId))
                        .map(userId => rsocket.simpleRequestResponse(USER_SHORT_INFO_ROUTE, {userId: userId}, addAuthData(user.username))
                            .pipe(tap((user: IUser) => dispatch({type: UPDATE_USER_LIST, payload: user})))
                        ))
                        .pipe(
                            defaultIfEmpty([]),
                            map(cached => {
                                const {users}: any = getState().user;
                                return list.map((msg: IMessage) => {
                                        msg.user = users.find((item: IUser) => item.id === msg.userId);
                                        return msg;
                                    }
                                )
                            })
                        )
                })
            )
            .subscribe((messages: any) => {
                dispatch({type: UPDATE_CHAT_HISTORY, payload: messages});
                dispatch({type: UPDATE_CHAT_CASH, payload: { type: 'history', data: messages}});
                callback();
            });
    }
}

const getChatInfoByUserId = (userId: number, chats: [IChat]) => {
    return chats.find((item: IChat) => {
        return (!item.group && item.users.includes(userId));
    });
}

const createChat = (rsocket: any, friend: IUser, myUser: IUser) => {
    return new Promise((resolve) => {
        rsocket.simpleRequestResponse(
            CHAT_CREATE_ROUTE, {users: [friend.id, myUser.id]}, addAuthData(myUser.username))
            .subscribe((result: any) => resolve(result));
    })
}
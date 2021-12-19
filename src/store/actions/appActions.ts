import {Dispatch} from "redux";
import {SpringRSocketMessagingBuilder} from "rsocket-rxjs";

import {IChat, IUser} from "../../interfaces";
import {isChatExist} from "./chatActions";
import {getUserShortInfo} from "./userActions";
import {ActionType, AppStateType} from "../index";
import {
    CONNECT,
    CREATE_USER,
    SET_CHAT_HISTORY,
    SET_CHAT_LIST,
    UPDATE_CHAT_CASH,
} from "../actionTypes";

import {
    CHAT_INFO_ROUTE,
    CHAT_LIST_ROUTE,
    USER_LOGIN_ROUTE,
    MESSAGE_STREAM_ROUTE,
} from "./routes";
import {addAuthData} from "../authHelper";

export function createRsocketConnection() {
    return async (dispatch:Dispatch<ActionType>) => {
        new SpringRSocketMessagingBuilder()
            .connectionString('wss://green-chat-hpthl.ondigitalocean.app')
            .build()
            .subscribe(rsocket => {
                dispatch({type: CONNECT, payload: rsocket});
            });
    };
}

export function startSession(username:string, callback:() => void) {

    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        const {rsocket}:any = getState().app;
        rsocket.simpleRequestResponse(USER_LOGIN_ROUTE, { username: username, password: 'pass' })
            .subscribe((user:any) => {
                dispatch({type: CREATE_USER, payload: user});
                getChatList(rsocket, dispatch, user);
                connectToMessageSession(rsocket, getState, dispatch, user);
                localStorage.setItem('username', `${user.username}`);
                localStorage.setItem('userId', `${user.id}`);
                callback();
            });
    };
}

const getChatList = (rsocket:any, dispatch: Dispatch<ActionType>,  user: IUser) => {
    rsocket.simpleRequestStream(CHAT_LIST_ROUTE,{ userId: user.id }, undefined, addAuthData(user.username))
        .subscribe((value:any) => {
            dispatch({type: SET_CHAT_LIST, payload: value});
        });
}

const connectToMessageSession = (rsocket:any, getState: () => AppStateType, dispatch:Dispatch<ActionType>, user:IUser) => {
    const authData = addAuthData(user.username);
    rsocket.simpleRequestStream(MESSAGE_STREAM_ROUTE, { userId: user.id },undefined, authData)
        .subscribe((data:any) => {
            const {
                chats,
                rsocket,
                currentChat,
                chatCash
            }:any = getState().app;
            const {users}:any = getState().user;

            if (!isChatExist(data.chatId, chats)) {
                rsocket.simpleRequestResponse(CHAT_INFO_ROUTE, { chatId: data.chatId }, authData)
                    .subscribe((chatData:IChat) => {
                        dispatch({type: SET_CHAT_LIST, payload: chatData});
                        getUserShortInfo(rsocket, dispatch, users, data.userId, user).subscribe(result => {
                            dispatch({type: UPDATE_CHAT_CASH, payload: { type: 'one', data: [{...data, user: result}]}});
                        });
                    });
            } else {
                getUserShortInfo(rsocket, dispatch, users, data.userId, user).subscribe(result => {
                    if(data.chatId === currentChat.id) {
                        dispatch({type: SET_CHAT_HISTORY, payload: {...data, user: result}});
                    }
                    if(chatCash[data.chatId] && chatCash[data.chatId].length) {
                        dispatch({type: UPDATE_CHAT_CASH, payload: { type: 'one', data: [{...data, user: result}]}});
                    }
                    // new message
                })
            }
        })
}
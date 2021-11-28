import {
  CONNECT,
  CREATE_MESSAGE_STREAM,
  CREATE_USER,
  SEARCH_USER,
  SET_CHAT_LIST,
  SET_CURRENT_CHAT, SET_CHAT_HISTORY, RESET_CURRENT_CHAT, UPDATE_USER_HASH,
} from './actionTypes';
import {
  APPLICATION_JSON,
  IdentitySerializer,
  JsonSerializer,
  MESSAGE_RSOCKET_ROUTING,
  RSocketClient
} from "rsocket-core";

import RSocketWebSocketClient from "rsocket-websocket-client";
import {ActionType, AppStateType} from "./index";
import {Dispatch} from "redux";
import {IChat, IMessage, IUser} from "../interfaces";
import {ReactiveSocket} from "rsocket-types";

const configConnection = () => {
  return new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      keepAlive: 10000,
      lifetime: 30000,
      dataMimeType: APPLICATION_JSON.string,
      metadataMimeType: MESSAGE_RSOCKET_ROUTING.string
    },
    transport: new RSocketWebSocketClient({
      url: "wss://green-chat-hpthl.ondigitalocean.app",
    }),
  });
};

export function createConnection() {
  return async (dispatch:Dispatch<ActionType>) => {
    configConnection().connect().then(
      (socket:ReactiveSocket<any, any>) => {
        dispatch({type: CONNECT, payload: socket});
      },
      (error:Error) => console.log("Connection has been refused due to:: " + error)
    );
  };
}

export function startSession(username:string) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
      const {rsocket}:any = getState().app;
      rsocket.requestResponse({
        data: { username: username },
        metadata: String.fromCharCode("user.login".length) + "user.login"
      }).subscribe({
        onComplete: (data:any) => {
          const user = JSON.parse(JSON.stringify(data.data));
          dispatch({type: CREATE_USER, payload: user});
          connectToChatSession(rsocket, dispatch, user);
          // connectToUserListSession(rsocket, dispatch, user);
          connectToMessageSession(rsocket, getState, dispatch, user);
        }
      });
  };
}

const connectToChatSession = (socket:ReactiveSocket<any, any>, dispatch: Dispatch<ActionType>,  user: IUser) => {
  socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("chat.list".length) + "chat.list"
      }).subscribe({
    onNext: (value) => {
      dispatch({type: SET_CHAT_LIST, payload: value.data});
    },
    onError: (err:Error) => {
      console.log(err);
    },
    onComplete: () => {},
    onSubscribe: (sub) => {
      sub.request(1000)
    }
  });
}

export function sendMessage(message:string) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket, currentChat}:any = getState().app;
    const {user} = getState().user;

    rsocket.fireAndForget({
      data: { chatId: currentChat.id, userId: user.id, message: message},
      metadata: String.fromCharCode("message.send".length) + "message.send"
    });
  };
}

const connectToMessageSession = (socket:ReactiveSocket<any, any>, getState: () => AppStateType, dispatch:Dispatch<ActionType>, user:IUser) => {
  socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("message.stream".length) + "message.stream"
      }).subscribe({
    onNext: ({data}) => {
      const {currentChat, usersHash, rsocket, chats}:any = getState().app;
      if(data.chatId === currentChat.id) {
        getUserShortInfo(rsocket, dispatch, usersHash, data.userId).then((result) => {
          dispatch({type: SET_CHAT_HISTORY, payload: {...data, user: result}});
        })
      } else if (!isChatExist(data.chatId, chats)) {
        rsocket.requestResponse({
          data: { chatId: data.chatId },
          metadata: String.fromCharCode("chat.info".length) + "chat.info"
        }).subscribe({
          onComplete: (result:any) => {
            dispatch({type: SET_CHAT_LIST, payload: result.data});
          }
        });
      }
    },
    onError: (err:Error) => {
      console.log(err, 'err');
    },
    onComplete: () => {},
    onSubscribe: (sub) => {
      dispatch({type: CREATE_MESSAGE_STREAM, payload: sub});
      sub.request(1000)
    }
  });
}

const isChatExist = (chatId:number, chats: [IChat]) => {
  return !!(chats.find(item => item.id === chatId));
}

export function getUserShortInfo(rsocket:any, dispatch:Dispatch<ActionType>, userList:Array<IUser>, userId:number) {
  return new Promise((resolve) => {
    const user = userList.find((item:IUser) => item.id === userId);
    if(!user){
      rsocket.requestResponse({
        data: { userId: userId },
        metadata: String.fromCharCode("user.short.info".length) + "user.short.info"
      }).subscribe({
        onComplete: ({data}:any) => {
          dispatch({type: UPDATE_USER_HASH, payload: data});
          resolve(data);
        }
      });
    }
    else {
      resolve(user);
    }
  });
}

export function searchUser(search:string) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket}:any = getState().app;
      rsocket.requestResponse({
        data: { search: search },
        metadata: String.fromCharCode("user.search".length) + "user.search"
      }).subscribe({
        onComplete: (result:any) => dispatch({type: SEARCH_USER, payload: result.data})
      });
  }
}

const getChatByUser = (userId:number, chats: Array<IChat>) => {
  return chats.find((item) => {
    return (!item.group && item.users.includes(userId));
  });
}

const createChat = (rsocket:any, friend:IUser, myUser:IUser) => {
  return new Promise((resolve) => {
    rsocket.requestResponse({
      data: { users: [friend.id, myUser.id], userId: myUser.id },
      metadata: String.fromCharCode("chat.create".length) + "chat.create"
    }).subscribe({
      onComplete: (result:any) => resolve(result)
    });
  })
}

export function createChatWithUser(friend:IUser) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {chats, rsocket}:any = getState().app;
    const {user} = getState().user;
    const chat = getChatByUser(friend.id, chats);
    resetCurrentChat(dispatch);

    if(chat) {
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
      getHistory(getState, dispatch, chat.id);
    } else {
      createChat(rsocket, friend, user).then((result) => {
        rsocket.fireAndForget({
          data: { fromUserId: user.id, toUserId: friend.id, message: 'Hey! Let`s chat together' },
          metadata: String.fromCharCode("message.send".length) + "message.send"
        });
        return result;
      }).then((result:any) => {
        dispatch({type: SET_CHAT_LIST, payload: result.data});
        dispatch({type: SET_CURRENT_CHAT, payload: result.data});
      })
    }
  }
}

const getHistory = (getState: () => AppStateType, dispatch:Dispatch<ActionType>, chatId:number) => {
  const limit = 10;
  const {currentChat, usersHash, rsocket}:any = getState().app;
  rsocket.requestResponse(
      {
        data: { chatId, limit },
        metadata: String.fromCharCode("message.history".length) + "message.history"
      }).subscribe({
    onComplete: ({data}:any) => {
      data.forEach((message:IMessage) => {
        if(message.chatId === currentChat.id) {
          getUserShortInfo(rsocket, dispatch, usersHash, message.userId).then((result) => {
            dispatch({type: SET_CHAT_HISTORY, payload: {...message, user: result}});
          })
        }
      });
    },
    onError: (err:Error) => {
      console.log(err, 'err');
    },
  });
}

export function openCurrentChat(chat:IChat) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    resetCurrentChat(dispatch);
    dispatch({type: SET_CURRENT_CHAT, payload: chat});
    getHistory(getState, dispatch, chat.id);
  }
}

const resetCurrentChat = (dispatch:Dispatch<ActionType>) => {
  dispatch({type: RESET_CURRENT_CHAT, payload: null});
}
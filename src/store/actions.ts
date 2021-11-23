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
import {IChat, IUser} from "../interfaces";
import {ISubscription, ReactiveSocket} from "rsocket-types";

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
          connectToMessageSession(rsocket, dispatch, user);
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

const connectToMessageSession = (socket:ReactiveSocket<any, any>, dispatch:Dispatch<ActionType>, user:IUser) => {
  socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("message.stream".length) + "message.stream"
      }).subscribe({
    onNext: (value) => {
      // dispatch({type: SET_CHAT_HISTORY, payload: value.data});
      console.log(value.data, 'messageSession');
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

// const transformPersonalChatData = (socket:ReactiveSocket<any, any>, dispatch: Dispatch<ActionType>,  user: IUser, incomingData:any) => {
//   return new Promise((resolve) => {
//     if (!incomingData.group) {
//       const users = incomingData.users;
//       const friendId = (users.filter((item:any) => item !== user.id))[0];
//       getShortInfo(friendId, socket).then(({data}:any) => {
//         resolve({
//           id: incomingData.id,
//           users: [user, data],
//           name: incomingData.name,
//           group: incomingData.group,
//           created: incomingData.created
//         });
//       });
//     }
//   });
// }


// export function getUserShortInfo(userId:number) {
//   return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
//     const {rsocket} = getState().app;
//       rsocket.requestResponse({
//         data: { userId: userId },
//         metadata: String.fromCharCode("user.short.info".length) + "user.short.info"
//       }).subscribe({
//         onComplete: (data:Payload<any, any>) => {
//           dispatch({type: GET_USER_INFO, payload: data});
//         }
//       });
//   }
// }

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
    if(chat) {
      // call to history
      console.log('openCurrentChat 0', chat);
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
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
        console.log(result, 'result openCurrentChat');
      })
    }
  }
}

const getHistory = (socket:any, dispatch:Dispatch<ActionType>, chatId:number) => {
  const limit = 10;
  socket.requestStream(
      {
        data: { chatId, limit },
        metadata: String.fromCharCode("message.history".length) + "message.history"
      }).subscribe({
    onNext: (value:any) => {
      dispatch({type: SET_CHAT_HISTORY, payload: value.data});
      console.log(value.data, 'getHistory onNext');
    },
    onError: (err:Error) => {
      console.log(err, 'err');
    },
    onSubscribe: (sub:ISubscription) => {
      sub.request(1000)
    }
  });
}

export function openCurrentChat(chat:IChat) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket} = getState().app;

    resetCurrentChat(dispatch);
    getHistory(rsocket, dispatch, chat.id);
    dispatch({type: SET_CURRENT_CHAT, payload: chat});
  }
}

const resetCurrentChat = (dispatch:Dispatch<ActionType>) => {
  dispatch({type: RESET_CURRENT_CHAT, payload: null});
}

export function getUserInfoById(userId:number) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket}:any = getState().app;
      rsocket.requestResponse({
        data: { userId: userId },
        metadata: String.fromCharCode("user.short.info".length) + "user.short.info"
      }).subscribe({
        onComplete: (data:any) => {
          dispatch({type: UPDATE_USER_HASH, payload: data});
        }
      });
  }
}
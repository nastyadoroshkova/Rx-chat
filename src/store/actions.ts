import {
  CONNECT,
  CREATE_MESSAGE_STREAM,
  CREATE_USER,
  SEARCH_USER,
  SET_CHAT_LIST,
  SET_USER_LIST,
  SET_CURRENT_CHAT,
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
import {Payload, ReactiveSocket} from "rsocket-types";

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
      const {rsocket} = getState().app;
      rsocket.requestResponse({
        data: { username: username },
        metadata: String.fromCharCode("user.login".length) + "user.login"
      }).subscribe({
        onComplete: (data:Payload<any, any>) => {
          const user = JSON.parse(JSON.stringify(data.data));
          dispatch({type: CREATE_USER, payload: user});
          connectToChatSession(rsocket, dispatch, user);
          // connectToUserListSession(rsocket, dispatch, user);
          // connectToMessageSession(rsocket, dispatch, user);
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
    const {rsocket} = getState().app;
    const {user} = getState().user;

    rsocket.fireAndForget({
      data: { fromUserId: user.id, toUserId: null, message: message},
      metadata: String.fromCharCode("message.send".length) + "message.send"
    });
  };
}

const connectToMessageSession = (socket:ReactiveSocket<any, any>, dispatch:Dispatch<ActionType>, user:IUser) => {
  socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("messages.stream".length) + "messages.stream"
      }).subscribe({
    onNext: (value) => {
      // getShortInfo(value.data.fromUserId, socket).then(({data}:any) => {
      //   const fromUser = data;
      //   if(value.data.toUserId) {
      //     getShortInfo(value.data.toUserId, socket).then(({data}:any) => {
      //       const toUser = data;
      //       const message = {message: value.data.message, timestamp: value.data.timestamp, fromUser, toUser};
      //       dispatch({type: RECEIVE_MESSAGE, payload: message});
      //     });
      //   } else {
      //     const message = {message: value.data.message, timestamp: value.data.timestamp, fromUser, toUser: null};
      //     dispatch({type: RECEIVE_MESSAGE, payload: message});
      //   }
      // });
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

const connectToUserListSession = (socket:ReactiveSocket<any, any>, dispatch: Dispatch<ActionType>, user: IUser) => {
  socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("user.stream".length) + "user.stream"
      }).subscribe({
    onNext: (value) => {
      console.log("user.stream", value, "user.stream");
      dispatch({type: SET_USER_LIST, payload: value.data});
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
    const {rsocket} = getState().app;
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
  console.log('createChat');
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
    const {chats, rsocket} = getState().app;
    const {user} = getState().user;
    const chat = getChatByUser(friend.id, chats);
    if(chat) {
      // call to history
      console.log('openCurrentChat 0', chat);
      dispatch({type: SET_CURRENT_CHAT, payload: chat});
    } else {
      createChat(rsocket, friend, user).then((result:any) => {
        dispatch({type: SET_CHAT_LIST, payload: result.data});
        dispatch({type: SET_CURRENT_CHAT, payload: result.data});
        console.log(result, 'result openCurrentChat');
      })
    }
  }
}

export function openCurrentChat(chat:IChat) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    // call to history
    dispatch({type: SET_CURRENT_CHAT, payload: chat});
  }
}
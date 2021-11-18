import {
  CONNECT,
  CREATE_USER,
  SET_USER_LIST,
  CREATE_MESSAGE_STREAM,
  RECEIVE_MESSAGE
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
import {IUser} from "../interfaces";
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
          connectToUserListSession(rsocket, dispatch, user);
          connectToMessageSession(rsocket, dispatch, user);
        }
      });
  };
}

const getShortInfo = (userId:string, rsocket: ReactiveSocket<any, any>) => {
  return new Promise((resolve) => {
    rsocket.requestResponse({
      data: { userId: userId },
      metadata: String.fromCharCode("users.short.info".length) + "users.short.info"
    }).subscribe({
      onComplete: (data) => {
        resolve(data);
      }
    });
  })
}

const connectToMessageSession = (socket:ReactiveSocket<any, any>, dispatch:Dispatch<ActionType>, user:IUser) => {
  socket.requestStream(
    {
      data: { userId: user.id },
      metadata: String.fromCharCode("messages.stream".length) + "messages.stream"
    }).subscribe({
    onNext: (value) => {
      getShortInfo(value.data.fromUserId, socket).then(({data}:any) => {
        const fromUser = data;
        if(value.data.toUserId) {
          getShortInfo(value.data.toUserId, socket).then(({data}:any) => {
            const toUser = data;
            const message = {message: value.data.message, timestamp: value.data.timestamp, fromUser, toUser};
            dispatch({type: RECEIVE_MESSAGE, payload: message});
          });
        } else {
          const message = {message: value.data.message, timestamp: value.data.timestamp, fromUser, toUser: null};
          dispatch({type: RECEIVE_MESSAGE, payload: message});
        }
      });
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
        metadata: String.fromCharCode("users.stream".length) + "users.stream"
      }).subscribe({
      onNext: (value) => {
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

export function openChat(id: string) {
  console.log(id, 'open chat')
}
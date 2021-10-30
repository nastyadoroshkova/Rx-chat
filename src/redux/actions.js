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

let currentSocket = null;

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
  return async (dispatch) => {
    configConnection().connect().then(
      (socket) => {
        dispatch({type: CONNECT, payload: socket});
      },
      (error) => console.log("Connection has been refused due to:: " + error)
    );
  };
}

export function startSession(username) {
  return (dispatch, getState) => {
      const {rsocket} = getState().app;
      currentSocket = rsocket;
      rsocket.requestResponse({
        data: { username: username },
        metadata: String.fromCharCode("users.login".length) + "users.login"
      }).subscribe({
        onComplete: (data) => {
          const user = JSON.parse(JSON.stringify(data.data));
          console.log("my user: ", user);
          dispatch({type: CREATE_USER, payload: user});
          connectToUserListSession(rsocket, dispatch, user);
          connectToMessageSession(rsocket, dispatch, user);
        }
      });
  };
}

const getShortInfo = (userId) => {
  return new Promise((resolve) => {
    currentSocket.requestResponse({
      data: { userId: userId },
      metadata: String.fromCharCode("users.short.info".length) + "users.short.info"
    }).subscribe({
      onComplete: (data) => {
        resolve(data);
      }
    });
  })
}

const connectToMessageSession = (socket, dispatch, user) => {
  socket.requestStream(
    {
      data: { userId: user.id },
      metadata: String.fromCharCode("messages.stream".length) + "messages.stream"
    }).subscribe({
    onNext: (value) => {
      getShortInfo(value.data.fromUserId).then(({data}) => {
        const fromUser = data;
        if(value.data.toUserId) {
          getShortInfo(value.data.toUserId).then(({data}) => {
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
    onError: (err) => {
      console.log(err, 'err');
    },
    onComplete: () => {},
    onSubscribe: (sub) => {
      dispatch({type: CREATE_MESSAGE_STREAM, payload: sub});
      sub.request(1000)
    }
  });
}

const connectToUserListSession = (socket, dispatch, user) => {
    socket.requestStream(
      {
        data: { userId: user.id },
        metadata: String.fromCharCode("users.stream".length) + "users.stream"
      }).subscribe({
      onNext: (value) => {
        dispatch({type: SET_USER_LIST, payload: value.data});
      },
      onError: (err) => {
        console.log(err);
      },
      onComplete: () => {},
      onSubscribe: (sub) => {
        sub.request(1000)
      }
    });
}

export function sendMessage(message) {
  return (dispatch, getState) => {
    const {user, rsocket} = getState().app;
    rsocket.fireAndForget({
      data: { fromUserId: user.id, toUserId: null, message: message},
      metadata: String.fromCharCode("message.send".length) + "message.send"
    });
  };
}

export function openChat(userId) {

}
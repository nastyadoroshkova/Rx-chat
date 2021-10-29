import {
  CONNECT,
  CREATE_USER,
  GET_LIST_USER,
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
import {v4 as uuidv4} from "uuid";

const configClient = () => {
  return new RSocketClient({
    serializers: {
      data: JsonSerializer,
      metadata: IdentitySerializer
    },
    setup: {
      keepAlive: 180000,
      lifetime: 360000,
      dataMimeType: APPLICATION_JSON.string,
      metadataMimeType: MESSAGE_RSOCKET_ROUTING.string
    },
    transport: new RSocketWebSocketClient({
      url: "wss://green-chat-hpthl.ondigitalocean.app",
    }),
  });
};

export function createConnection() {
  console.log('createConnection');
  return async (dispatch) => {
    try {
      configClient().connect().then(
        (socket) => {
          dispatch({type: CONNECT, payload: socket});
        },
        (error) => console.log("Connection has been refused due to:: " + error)
      );
    } catch (e) {
      // todo
    }
  };
}

export function startSession(username) {
  const user = {id: uuidv4(), username: username};

  return (dispatch, getState) => {
    dispatch({type: CREATE_USER, payload: user});
      const {rsocket} = getState().app;
      rsocket.requestResponse({
        data: user,
        metadata: String.fromCharCode("users.login".length) + "users.login"
      }).subscribe({
        onComplete: (response) => {
          console.log("my user: " + response)
          getUsersSession(rsocket, dispatch);
        }
      });

      rsocket.requestStream(
        {
          metadata: String.fromCharCode("messages.stream".length) + "messages.stream"
        }).subscribe({
        onNext: (value) => {
          console.log(value.data, 'next');
          dispatch({type: RECEIVE_MESSAGE, payload: value.data});
        },
        onError: (err) => {
          console.log(err, 'err');
        },
        onComplete: () => {
          console.log('complete');
        },
        onSubscribe: (sub) => {
          dispatch({type: CREATE_MESSAGE_STREAM, payload: sub});
          sub.request(1000)
        }
      });
  };
}

export function sendMessage(message) {
  console.log('sendMessage', message);
  return async (dispatch, getState) => {
    const {user, rsocket} = getState().app;
    rsocket.fireAndForget({
      data: {user, message},
      metadata: String.fromCharCode("message.send".length) + "message.send"
    });
  };
}

export function getUsersSession(socket, dispatch) {
  console.log('getUsersSession');
    socket.requestStream(
      {
        metadata: String.fromCharCode("users.stream".length) + "users.stream"
      }).subscribe({
      onNext: (value) => {
        console.log(value, 'getUsersSession next');
        dispatch({type: GET_LIST_USER, payload: value.data});
      },
      onError: (err) => {
        console.log(err, 'getUsersSession err');
      },
      onComplete: () => {
        console.log('getUsersSession complete');
      },
      onSubscribe: (sub) => {
        console.log('getUsersSession onSubscribe', sub);
        sub.request(1000)
      }
    });
}
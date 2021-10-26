import {CONNECT, CREATE_USER, CREATE_MESSAGE_STREAM, RECEIVE_MESSAGE} from './actionTypes';
import {
  APPLICATION_JSON,
  IdentitySerializer,
  JsonSerializer,
  MESSAGE_RSOCKET_ROUTING,
  RSocketClient
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";

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
      url: "wss://green-chat-33jco.ondigitalocean.app",
    }),
  });
};

export function createConnection() {
  console.log('createConnection');
  return async (dispatch) => {
    try {
      configClient().connect().then(
        (socket) => {
          dispatch({ type: CONNECT, payload: socket });
        },
        (error) => console.log("Connection has been refused due to:: " + error)
      );
    } catch (e) {
      // todo
    }
  };
}

export function startSession(username) {
  console.log('startSession');
  return async (dispatch, getState) => {
    try {
      const { rsocket } = getState().app;
      rsocket.requestStream(
        {
          data: {username},
          metadata: String.fromCharCode("messages.stream".length) + "messages.stream"
        }).subscribe({
        onNext: (value) => {
          console.log(value.data, 'next');
          dispatch({ type: RECEIVE_MESSAGE, payload: value.data });
        },
        onError: (err) => {
          console.log(err, 'err');
        },
        onComplete: () => {
          console.log('complete');
        },
        onSubscribe: (sub) => {
          dispatch({ type: CREATE_USER, payload: username });
          dispatch({ type: CREATE_MESSAGE_STREAM, payload: sub });
          sub.request(1000)
        }
      });
    } catch (e) {
      // todo
    }
  };
}

export function sendMessage(message) {
  console.log('sendMessage');
  return async (dispatch, getState) => {
    const { username, rsocket } = getState().app;
    try {
      rsocket.fireAndForget({
        data: {username, message},
        metadata: String.fromCharCode("message.send".length) + "message.send"
      });
    } catch (e) {
      // todo
    }
  };
}
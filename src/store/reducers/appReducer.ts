import {
  CONNECT, CREATE_MESSAGE_STREAM,
} from "../actionTypes";
import {ReactiveSocket} from "rsocket-types";

const initialState = {
  rsocket: {} as ReactiveSocket<any,any>,
  subscription: {} as ReactiveSocket<any,any>,

};

export const appReducer = (state = initialState, action:AppActionType) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case CREATE_MESSAGE_STREAM:
      return { ...state, subscription: action.payload };
    default:
      return state;
  }
};

type ConnectType = {
  type: typeof CONNECT,
  payload: any
}

type ConnectMessageStreamType = {
  type: typeof CREATE_MESSAGE_STREAM,
  payload: any
}

export type AppActionType = ConnectType | ConnectMessageStreamType;
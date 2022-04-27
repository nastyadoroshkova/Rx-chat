import {
  GET_COMMON_MESSAGES,
  GET_DIRECT_MESSAGES,
  RECEIVE_MESSAGE,
} from '../actionTypes';

import {IMessage} from '../../interfaces';

const initialState = {
  commonMessageList: [] as Array<IMessage>,
  directMessageList: [] as Array<IMessage>,
  messages: {} as Array<IMessage>,
};

type InitialState = typeof initialState;

export const messageReducer = (state = initialState, action: MessageActionType):InitialState => {
  switch (action.type) {
  case RECEIVE_MESSAGE:
    return { ...state, messages: [...state.messages, action.payload] };
  case GET_COMMON_MESSAGES:
    return { ...state, commonMessageList: action.payload };
  case GET_DIRECT_MESSAGES:
    return { ...state, directMessageList: action.payload };
  default:
    return state;
  }
};

type ReceiveMessageType = {
    type: typeof RECEIVE_MESSAGE,
    payload: any
}

type GetCommonMessagesType = {
    type: typeof GET_COMMON_MESSAGES,
    payload: Array<IMessage>
}

type GetDirectMessagesType = {
    type: typeof GET_DIRECT_MESSAGES,
    payload: Array<IMessage>
}

export type MessageActionType = ReceiveMessageType | GetCommonMessagesType | GetDirectMessagesType;
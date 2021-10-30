import {
  CONNECT,
  CREATE_MESSAGE_STREAM,
  CREATE_USER,
  SET_USER_LIST,
  RECEIVE_MESSAGE,
  GET_COMMON_MESSAGES,
  GET_DIRECT_MESSAGES,
} from "../../actionTypes";

const initialState = {
  rsocket: null,
  commonMessageList: [],
  directMessageList: [],
  messages: [],
  user: null,
  subscription: null,
  users: [],
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case CREATE_MESSAGE_STREAM:
      return { ...state, subscription: action.payload };
    case CREATE_USER:
      return { ...state, user: action.payload };
    case RECEIVE_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    case SET_USER_LIST:
      return { ...state, users: action.payload };
    case GET_COMMON_MESSAGES:
      return { ...state, commonMessageList: action.payload };
    case GET_DIRECT_MESSAGES:
      return { ...state, directMessageList: action.payload };
    default:
      return state;
  }
};

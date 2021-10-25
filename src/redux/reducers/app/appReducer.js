import { CONNECT, CREATE_MESSAGE_STREAM, CREATE_USER, RECEIVE_MESSAGE } from "../../actionTypes";

const initialState = {
  rsocket: null,
  messages: [],
  username: null,
  subscription: null,
};

export const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case CONNECT:
      return { ...state, rsocket: action.payload };
    case CREATE_MESSAGE_STREAM:
      return { ...state, subscription: action.payload };
    case CREATE_USER:
      return { ...state, username: action.payload };
    case RECEIVE_MESSAGE:
      return { ...state, messages: [...state.messages, action.payload] };
    default:
      return state;
  }
};

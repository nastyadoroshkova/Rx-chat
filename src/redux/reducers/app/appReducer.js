import {CONNECT, CREATE_MESSAGE_STREAM, CREATE_USER, GET_LIST_USER, RECEIVE_MESSAGE} from "../../actionTypes";

const initialState = {
  rsocket: null,
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
    case GET_LIST_USER:
      return { ...state, users: action.payload };
    default:
      return state;
  }
};

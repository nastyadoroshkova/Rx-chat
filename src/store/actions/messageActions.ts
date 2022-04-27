import {Dispatch} from 'redux';

import {ActionType, AppStateType} from '../index';

import {MESSAGE_SEND_ROUTE} from './routes';

export function sendMessage(message:string) {
  return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket, currentChat}:any = getState().app;
    const {user} = getState().user;

    rsocket.simpleRequestFNF(
      MESSAGE_SEND_ROUTE,
      { chatId: currentChat.id, userId: user.id, message: message},
    ); // uuid, created???
  };
}
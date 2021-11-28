import {Dispatch} from "redux";

import {IUser} from "../../interfaces";
import {ActionType, AppStateType} from "../index";

import {
    SEARCH_USER,
    UPDATE_USER_HASH
} from "../actionTypes";

import {
    USER_SEARCH_ROUTE,
    USER_SHORT_INFO_ROUTE,
} from "./routes";

export function getUserShortInfo(rsocket:any, dispatch:Dispatch<ActionType>, userList:Array<IUser>, userId:number) {
    return new Promise((resolve) => {
        const user = userList.find((item:IUser) => item.id === userId);
        if(!user){
            rsocket.simpleRequestResponse(USER_SHORT_INFO_ROUTE,{ userId: userId })
                .subscribe((data:any) => {
                    dispatch({type: UPDATE_USER_HASH, payload: data});
                    resolve(data);
                });
        }
        else {
            resolve(user);
        }
    });
}

export function searchUser(search:string) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket}:any = getState().app;
      rsocket.simpleRequestResponse(USER_SEARCH_ROUTE, { search: search })
          .subscribe((result:any) => dispatch({type: SEARCH_USER, payload: result}));
  }
}
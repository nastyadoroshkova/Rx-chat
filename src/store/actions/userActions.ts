import {Dispatch} from "redux";

import {IUser} from "../../interfaces";
import {ActionType, AppStateType} from "../index";

import {SEARCH_USER, UPDATE_USER_LIST} from "../actionTypes";

import {USER_SEARCH_ROUTE, USER_SHORT_INFO_ROUTE,} from "./routes";
import {from, Observable, tap} from "rxjs";

export function getUserShortInfo(rsocket: any, dispatch: Dispatch<ActionType>, userList: Array<IUser>, userId: number, iam: IUser): Observable<IUser> {
    const user = userList.find((item: IUser) => item.id === userId);
    return !user
        ? rsocket.simpleRequestResponse(USER_SHORT_INFO_ROUTE, {userId: userId}, {
            type: 'simple',
            username: iam.username,
            password: 'pass'
        }).pipe(tap(found => dispatch({type: UPDATE_USER_LIST, payload: found})))
        : from([user]);
}

export function searchUser(search:string) {
  return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
    const {rsocket}:any = getState().app;
      rsocket.simpleRequestResponse(USER_SEARCH_ROUTE, { search: search })
          .subscribe((result:any) => dispatch({type: SEARCH_USER, payload: result}));
  }
}
import {Dispatch} from "redux";

import {IUser} from "../../interfaces";
import {ActionType, AppStateType} from "../index";

import {GET_FRIENDS, SEARCH_USER, UPDATE_USER_LIST, SEARCH_FRIENDS} from "../actionTypes";

import {USER_FRIENDS_ROUTE, USER_SEARCH_ROUTE, USER_SHORT_INFO_ROUTE} from "./routes";
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

export function getFriends() {
    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        const {rsocket}:any = getState().app;
        const {user}:any = getState().user;
        rsocket.simpleRequestResponse(USER_FRIENDS_ROUTE, null, {
            type: 'simple',
            username: user.username,
            password: 'pass'
        })
            .subscribe((result:any) => {
                dispatch({type: GET_FRIENDS, payload: result})
                dispatch({type: SEARCH_FRIENDS, payload: result})
            });
    }
}

export function searchFriends(search:string) {
    return (dispatch:Dispatch<ActionType>, getState: () => AppStateType) => {
        const {friends}:any = getState().user;
        const result = friends.filter((item:IUser) => {
            return (item.username.toLowerCase()).includes(search.toLowerCase());
        });
        dispatch({type: SEARCH_FRIENDS, payload: result})
    }
}
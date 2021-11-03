import { combineReducers } from "redux";

import {AppActionType, appReducer} from "./reducers/appReducer";
import {UserActionType, userReducer} from "./reducers/userReducer";
import {MessageActionType, messageReducer} from "./reducers/messageReducer";

export const rootReducer = combineReducers({
    app: appReducer,
    user: userReducer,
    message: messageReducer
});

export type RootReducerType = typeof rootReducer;
export type AppStateType = ReturnType<RootReducerType>;

export type ActionType = AppActionType | UserActionType | MessageActionType ;
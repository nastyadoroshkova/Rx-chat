import { combineReducers } from "redux";

import { appReducer } from "./reducers/app/appReducer";

export const rootReducer = combineReducers({
  app: appReducer,
});

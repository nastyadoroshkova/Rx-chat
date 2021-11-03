import React from 'react';
import ReactDOM from 'react-dom';

import thunk from "redux-thunk";
import { Provider } from "react-redux";
import { rootReducer } from "./store";
import { createStore, applyMiddleware } from "redux";

import App from './App';
import './index.css';

const store = createStore(rootReducer, applyMiddleware(thunk));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
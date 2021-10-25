import React, {useEffect} from "react";

import Chat from "./components/Chat";
import UserCreationForm from "./components/UserCreationForm";
import {useDispatch, useSelector} from "react-redux";
import { createConnection } from './redux/actions';

import "./App.scss";

function App() {
  const dispatch = useDispatch();
  const username = useSelector((state) => state.app.username);

  useEffect(() => {
    dispatch(createConnection());
  }, []);

  const body = () => {
    if(!username){
      return <UserCreationForm />
    } else {
      return <Chat/>
    }
  }

  return (
    <div className="app">
      <div className="app-header">
        <div className="app-header_logo">Green.</div>
        {username ? (
          <div className="app-header_user">
            <img/>
            <a>{username}</a>
          </div>
        ) : <div/>}
      </div>
      {body()}
    </div>
  );
}

export default App;

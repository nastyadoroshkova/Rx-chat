import React, {useEffect} from "react";

import Chat from "./components/Chat";
import UserCreationForm from "./components/UserCreationForm";
import {useDispatch, useSelector} from "react-redux";
import { createConnection } from './redux/actions';

import "./App.scss";
import UserList from "./components/UserList";

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
      return (
        <div className="chat-box">
          <div className="chat-box_userList">
            <div className="chat-box_userInfo">
              <div className="chat-box_userImg">
                <img src="images/image_user.png"/>
              </div>
              <div className="chat-box_userInfo-name">
                {username}
              </div>
            </div>
            <UserList/>
          </div>
          <div className="chat-box_chat">
            <Chat/>
          </div>
        </div>
      )
    }
  }

  return (
    <div className="app">
      {body()}
    </div>
  );
}

export default App;

import React, {useEffect} from "react";

import Chat from "./components/chat/Chat";
import { createConnection } from './redux/actions';
import {useDispatch, useSelector} from "react-redux";
import UserCreationForm from "./components/UserCreationForm";

import "./App.scss";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.app.user);

  useEffect(() => {
    dispatch(createConnection());
  }, [dispatch]);

  return (
    <div className="app">
      {
        user ? <Chat/> : <UserCreationForm />
      }
    </div>
  );
}

export default App;

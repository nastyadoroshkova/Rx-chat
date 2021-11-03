import React, {useEffect} from "react";

import Chat from "./components/chat/Chat";
import { createConnection } from './store/actions';
import {useDispatch, useSelector} from "react-redux";
import UserCreationForm from "./components/UserCreationForm";

import "./App.scss";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:any) => state.user.user);
  console.log(user, 'user');

  useEffect(() => {
    dispatch(createConnection());
  }, [dispatch]);

  return (
    <div className="app">
      {
        user.id ? <Chat/> : <UserCreationForm />
      }
    </div>
  );
}

export default App;

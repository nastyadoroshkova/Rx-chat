import React, {useEffect} from "react";

import Chat from "./components/chat/Chat";
import {useDispatch, useSelector} from "react-redux";
import Login from "./components/pages/Login";

import {createRsocketConnection} from "./store/actions/appActions";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state:any) => state.user.user);
  console.log(user, 'user');

  useEffect(() => {
    dispatch(createRsocketConnection());
  }, [dispatch]);

  return (
    <div className="app">
      {
        user.id ? <Chat/> : <Login />
      }
    </div>
  );
}

export default App;

import React, {useEffect} from "react";

import Chat from "./components/chat/Chat";
import {useDispatch, useSelector} from "react-redux";
import Login from "./components/pages/Login";

import {createRsocketConnection} from "./store/actions/appActions";

import {
  Routes,
  Route,
} from "react-router-dom";

import "./App.scss";

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createRsocketConnection());
  }, []);

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
}

export default App;

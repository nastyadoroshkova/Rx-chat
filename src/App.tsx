import React, {useEffect} from 'react';

import {useDispatch} from 'react-redux';

import {
  Routes,
  Route,
} from 'react-router-dom';

import Chat from './components/chat/Chat';
import Login from './components/pages/Login';

import {createRsocketConnection} from './store/actions/appActions';


import './App.scss';

const App: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(createRsocketConnection());
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Chat />} />
      </Routes>
    </div>
  );
};

export default App;

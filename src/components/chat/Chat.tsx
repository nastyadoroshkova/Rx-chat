import React, {useEffect} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {useNavigate} from 'react-router';

import {IChat} from '../../interfaces';

import {createRsocketConnection, startSession} from '../../store/actions/appActions';

import MessageList from './messages/MessageList';
import InputPanel from './messages/inputPanel/InputPanel';

import UserInfo from './user/userInfo/UserInfo';


import styles from './Chat.module.scss';
import CreateChat from './CreateChat';


const Chat:React.FC = () => {
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);
  const rsocket:any = useSelector((state:any) => state.app.rsocket);
  const isCreateGroup:any = useSelector((state:any) => state.app.isCreateGroup);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const username = localStorage.getItem('username');
    if(!username) {
      navigate('/login');
      return;
    }

    if(Object.keys(rsocket).length === 0) {
      dispatch(createRsocketConnection());
      dispatch(startSession(username, () => {}));
    }

    return () => {
      if (Object.keys(rsocket).length !== 0) {
        rsocket.close();
      }
    };
  }, [dispatch, navigate, rsocket]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.webView}>
        <UserInfo/>
        <div className={styles.chat}>
          {isCreateGroup ? <CreateChat /> :
            (currentChat?.id) ?
              <div>
                <div className={styles.chatInfo}>
                  <div className={styles.chatName}>{currentChat.name}</div>
                  <div className={styles.subscribers}>
                    {currentChat.group ? `${currentChat.users.length} subscribers` : null}
                  </div>
                </div>
                <MessageList/>
                <InputPanel />
              </div>
              :
              <div className={styles.empty}>Select a chat to start messaging</div>
          }
        </div>
      </div>
    </div>
  );
};

export default Chat;
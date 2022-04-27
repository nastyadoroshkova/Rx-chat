import React from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {IChat} from '../../../../interfaces';

import {openCurrentChat} from '../../../../store/actions/chatActions';

import styles from './ChatInfo.module.scss';


type PropsType = {
    item: IChat
}

const formatTime = (date:Date) => {
  const created = new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${created}`;
};

const ChatInfo:React.FC<PropsType> = ({item}) => {
  const dispatch = useDispatch();
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);
  const lastMessage = item.lastMessage;
  const created = lastMessage.created ? formatTime(lastMessage.created) : '';
  const isReadMessage = item.lastMessage.read;

  return (
    <div 
      onClick={() => {dispatch(openCurrentChat(item));}} 
      className={(currentChat?.id === item.id) ? styles.selected : styles.wrapper }
    >
      <div style={{backgroundColor: item.color}} className={styles.userImg}>
        {item.name?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.message}>{lastMessage.message}</div>
      </div>
      <div>
        <div className={styles.time}>
          {created}
        </div>
        {/* To do */}
        {isReadMessage && <div className={styles.messageBundle}>{1}</div>}
      </div>

    </div>
  );
};

export default ChatInfo;
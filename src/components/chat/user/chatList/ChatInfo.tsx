import React from "react";

import styles from './ChatInfo.module.scss';
import {IChat} from "../../../../interfaces";
import {openCurrentChat} from "../../../../store/actions/chatActions";
import {useDispatch, useSelector} from "react-redux";

type PropsType = {
    item: IChat
}

const formatTime = (date:Date) => {
    const created = new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    })
    return `${created}`
}

const ChatInfo:React.FC<PropsType> = ({item}) => {
  const dispatch = useDispatch();
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);
  const lastMessage = item.lastMessage;
  const created = formatTime(lastMessage.created);

  return (
    <div onClick={() => {dispatch(openCurrentChat(item))}} className={(currentChat.id === item.id) ? styles.selected : styles.wrapper }>
      <div style={{backgroundColor: item.color}} className={styles.userImg}>
        {item.name?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.message}>{lastMessage.message}</div>
      </div>
      <div className={styles.time}>
          {created}
      </div>
    </div>
  );
}

export default ChatInfo;
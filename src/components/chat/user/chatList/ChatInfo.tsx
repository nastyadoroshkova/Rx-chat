import React from "react";

import styles from './ChatInfo.module.scss';
import {IChat} from "../../../../interfaces";
import {openCurrentChat} from "../../../../store/actions/chatActions";
import {useDispatch, useSelector} from "react-redux";

type PropsType = {
    item: IChat
}

const ChatInfo:React.FC<PropsType> = ({item}) => {
  const dispatch = useDispatch();
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);

  return (
    <div onClick={() => {dispatch(openCurrentChat(item))}} className={(currentChat.id === item.id) ? styles.selected : styles.wrapper }>
      <div style={{backgroundColor: item.color}} className={styles.userImg}>
        {item.name?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{item.name}</div>
        <div className={styles.message}>Message ...</div>
      </div>
      <div className={styles.time}>
        11:25
      </div>
    </div>
  );
}

export default ChatInfo;
import React from "react";

import ChatList from "../chatList/ChatList";
import {useSelector} from "react-redux";

import styles from './UserInfo.module.scss';

const UserInfo = () => {
  const user = useSelector((state) => state.app.user);

  return (
    <div className={styles.wrapper}>
      <div className={styles.personalInfo}>
        <div style={{backgroundColor: user.color}} className={styles.personalImg}>
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className={styles.name}>
          {user.username}
        </div>
      </div>
      <div className={styles.chatList}>
        <ChatList/>
      </div>
    </div>
  );
}

export default UserInfo;
import React from "react";

import ChatInfoList from "../chatList/ChatInfoList";

import styles from './UserInfo.module.scss';
import {useSelector} from "react-redux";

const UserInfo:React.FC = () => {
  const user = useSelector((state:any) => state.user.user);

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
        <ChatInfoList/>
      </div>
    </div>
  );
}

export default UserInfo;
import React from "react";

import MessageList from "./messages/MessageList";
import InputPanel from "./messages/inputPanel/InputPanel";

import styles from "./Chat.module.scss";
import UserInfo from "./user/userInfo/UserInfo";

const Chat:React.FC = () => {
  return (
    <div className={styles.wrapper}>
      <UserInfo/>
      <div className={styles.chat}>
        <MessageList/>
        <InputPanel />
      </div>
    </div>
  );
}

export default Chat;
import React from "react";

import MessageList from "./messages/MessageList";
import InputPanel from "./messages/inputPanel/InputPanel";

import styles from "./Chat.module.scss";
import UserInfo from "./user/userInfo/UserInfo";
import {IChat} from "../../interfaces";
import {useSelector} from "react-redux";

const Chat:React.FC = () => {
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);

  return (
    <div className={styles.wrapper}>
      <UserInfo/>
      <div className={styles.chat}>
          {
              currentChat.id ? (
                  <div>
                      <div className={styles.chatName}>{currentChat.name}</div>
                      <MessageList/>
                      <InputPanel />
                  </div>
              ) :
             <div className={styles.empty}>Please select the chat ...</div>
          }
      </div>
    </div>
  );
}

export default Chat;
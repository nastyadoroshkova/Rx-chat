import React from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {useSelector} from "react-redux";

const MessageList = () => {
  const messages = useSelector((state) => state.app.messages);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages.map((item) => <Message key={Math.random()} item={item}/>)}
      </div>
    </div>
  );
}

export default MessageList;
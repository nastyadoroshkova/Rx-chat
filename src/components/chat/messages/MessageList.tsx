import React from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {IMessage} from "../../../interfaces";
import {useSelector} from "react-redux";

const MessageList:React.FC = () => {
  const messages:IMessage[] = useSelector((state:any) => state.app.chatHistory);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        <div className={styles.scrollable}>
          {messages.map((item:any) =>
            <Message key={Math.random()} item={item}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
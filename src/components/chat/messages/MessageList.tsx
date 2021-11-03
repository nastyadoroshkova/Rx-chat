import React from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {IUser} from "../../../interfaces";
import {useSelector} from "react-redux";

const MessageList:React.FC = () => {
  const messages:IUser[] = useSelector((state:any) => state.message.messages);

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        {messages.map((item:any) => <Message key={Math.random()} item={item}/>)}
      </div>
    </div>
  );
}

export default MessageList;
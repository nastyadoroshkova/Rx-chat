import React, {useEffect, useRef} from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {IMessage} from "../../../interfaces";
import {useSelector} from "react-redux";

const MessageList:React.FC = () => {
  const messagesEndRef = useRef(null);
  const messages:IMessage[] = useSelector((state:any) => state.app.chatHistory);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

    const scrollToBottom = () => {
        // @ts-ignore: Object is possibly 'null'.
        messagesEndRef.current?.scrollIntoView();
    }

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        <div className={styles.scrollable}>
          {messages.map((item:any) =>
            <Message key={Math.random()} item={item}/>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  );
}

export default MessageList;
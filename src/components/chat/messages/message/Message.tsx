import React from "react";

import styles from "./Message.module.scss";
import {IMessage} from "../../../../interfaces";

type PropsType = {
    item: IMessage
}

const Message: React.FC<PropsType> = ({item}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.userImg}>
        <span>{item.userId}</span>
      </div>
      <div>
        <div className={styles.message}>
          <div>{item.message} </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
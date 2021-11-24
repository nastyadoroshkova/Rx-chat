import React from "react";

import styles from "./Message.module.scss";
import {IMessage} from "../../../../interfaces";

type PropsType = {
    item: IMessage
}

const Message: React.FC<PropsType> = ({item}) => {
  return (
    <div className={styles.wrapper}>
      <div style={{backgroundColor: item.user?.color}} className={styles.userImg}>
        <span>{item.user?.username?.charAt(0).toUpperCase()}</span>
      </div>
      <div>
          <div className={styles.user}>
              <div style={{color: item.user?.color}}>
                  {item.user?.username}
              </div>
          </div>
        <div className={styles.message}>
          <div>{item.message} </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
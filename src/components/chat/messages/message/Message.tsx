import React from "react";

import styles from "./Message.module.scss";
import {IMessage} from "../../../../interfaces";
import {useSelector} from "react-redux";

type PropsType = {
    item: IMessage
}

const Message: React.FC<PropsType> = ({item}) => {
  const user = useSelector((state:any) => state.user.user);
  const isSelf = (user.id === item.fromUser.id);

  return (
    <div className={styles.wrapper}>
      <div style={{backgroundColor: item.fromUser.color}} className={styles.userImg}>
        <span>{item.fromUser.username?.charAt(0).toUpperCase()}</span>
      </div>
      <div>
        {
          item.fromUser ? (
            <div className={styles.user}>
              <div style={{color: item.fromUser.color}}>
                {isSelf ?  "You" : item.fromUser.username}
              </div>
            </div>
          ) : null
        }
        <div className={styles.message}>
          <div>{item.message} </div>
        </div>
      </div>
    </div>
  );
}

export default Message;
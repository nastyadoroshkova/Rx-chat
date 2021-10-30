import React from "react";

import {useSelector} from "react-redux";

import styles from "./Message.module.scss";

const Message = ({item}) => {
  const user = useSelector((state) => state.app.user);
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
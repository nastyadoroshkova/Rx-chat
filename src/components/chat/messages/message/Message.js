import React from "react";

import {useSelector} from "react-redux";

import styles from "./Message.module.scss";

const Message = ({item}) => {
  const user = useSelector((state) => state.app.user);
  const isSelf = (user.id === item.user.id);

  return (
    <div>
      {
        item.user ? (
          <div className={styles.user}>
            <div style={{color: item.user.color}}>
              {isSelf ?  "You" : item.user.username}
            </div>
          </div>
        ) : null
      }
      <div className={styles.message}>
        <div>{item.message} </div>
      </div>
    </div>
  );
}

export default Message;
import React from "react";

import styles from './SingleChat.module.scss';

const SingleChat = ({item}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.userImg}>
        <img src="images/1.jpg"/>
      </div>
      <div className={styles.userInfo}>
        <div style={{color: item.color}} className={styles.name}>{item.username}</div>
        <div className={styles.message}>Message ...</div>
      </div>
      <div className={styles.time}>
        11:25
      </div>
    </div>
  );
}

export default SingleChat;
import React from "react";

import styles from './SingleUser.module.scss';

const SingleUser = ({item}) => {
  return (
    <div className={styles.wrapper}>
      <div style={{backgroundColor: item.color}} className={styles.userImg}>
        {item.username?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{item.username}</div>
        <div className={styles.message}>Message ...</div>
      </div>
      <div className={styles.time}>
        11:25
      </div>
    </div>
  );
}

export default SingleUser;
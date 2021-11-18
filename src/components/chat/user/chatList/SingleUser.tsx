import React from "react";

import styles from './SingleUser.module.scss';
import {openChat} from "../../../../store/actions";
import {IUser} from "../../../../interfaces";
import {useDispatch} from "react-redux";

type PropsType = {
    item: IUser
}

const SingleUser:React.FC<PropsType> = ({item}) => {
  const dispatch = useDispatch();

  return (
    <div onClick={() => dispatch(openChat(item.id))} className={styles.wrapper}>
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
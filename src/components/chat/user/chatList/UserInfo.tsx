import React from "react";

import styles from './ChatInfo.module.scss';
import {IUser} from "../../../../interfaces";
import {useDispatch} from "react-redux";
import {createChatWithUser} from "../../../../store/actions";

type PropsType = {
    item: IUser
}

const ChatInfo:React.FC<PropsType> = ({item}) => {
    const dispatch = useDispatch();
    return (
        <div onClick={() => {dispatch(createChatWithUser(item))}} className={styles.wrapper}>
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

export default ChatInfo;
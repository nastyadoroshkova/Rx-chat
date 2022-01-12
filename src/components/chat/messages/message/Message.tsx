import React, {useMemo} from "react";

import styles from "./Message.module.scss";
import {IMessage, IUser} from "../../../../interfaces";
import {useSelector} from "react-redux";

type PropsType = {
    item: IMessage,
    isGroup: Boolean
}

const formatTime = (date:Date) => {
    const created = new Date(date).toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit'
    })
    return `${created}`
}

const Message: React.FC<PropsType> = ({item, isGroup}) => {
  const created = formatTime(item.created);
  const users = useSelector((state:any) => state.user.users);
  const user = useMemo(() => {
      return users.find((user:IUser) => user.id === item.userId )
  }, [users]);

  return (
    <div>
        {
            isGroup ? (
                <div className={styles.groupMessageWrapper}>
                    <div className={styles.groupMessage}>
                        <div>{item.message}</div>
                    </div>
                    <div className={styles.datetime}>{created}</div>
                </div>
            ) : (
                <div className={styles.wrapper}>
                    <div style={{backgroundColor: user?.color}} className={styles.userImg}>
                        <span>{user?.username?.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className={styles.box}>
                        <div className={styles.user}>
                            <div style={{color: user?.color}}>
                                {user?.username}
                            </div>
                            <div className={styles.datetime}>{created}</div>
                        </div>
                        <div className={styles.message}>
                            <div>{item.message}</div>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  );
}

export default Message;
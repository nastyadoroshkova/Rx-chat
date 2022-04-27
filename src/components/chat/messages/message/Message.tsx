import React, {useMemo} from 'react';

import {useSelector} from 'react-redux';

import emojiRegex from 'emoji-regex';

import {IMessage, IUser} from '../../../../interfaces';

import styles from './Message.module.scss';

type PropsType = {
    item: IMessage,
    isGroup: boolean
}

const regex = emojiRegex();

const formatTime = (date:Date) => {
  const created = new Date(date).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${created}`;
};

const getMessage = (isGroup:boolean, message:string) => {
  if(regex.test(message) && message.trim().length <= 2) {
    return <div className={styles.largeEmoji}>{message}</div>;
  }

  return isGroup ?
    <div className={styles.groupMessage}>{message}</div>
    : <div className={styles.message}>{message}</div>;
};

const Message: React.FC<PropsType> = ({item, isGroup}) => {
  const created = formatTime(item.created);
  const users = useSelector((state:any) => state.user.users);
  const user = useMemo(() => {
    return users.find((user:IUser) => user.id === item.userId );
  }, [users, item.userId]);

  return (
    <div>
      {
        isGroup ? (
          <div className={styles.groupMessageWrapper}>
            <div>{getMessage(true, item.message)}</div>
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
              <div>{getMessage(false, item.message)}</div>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default Message;
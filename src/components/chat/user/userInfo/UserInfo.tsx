import React, {useEffect, useRef, useState} from 'react';

import {useSelector} from 'react-redux';

import ChatInfoList from '../chatList/ChatInfoList';

import {SettingsSvg} from '../../../../assets/svg';

import styles from './UserInfo.module.scss';

const UserInfo: React.FC = () => {
  const [isOpen, changeState] = useState(false);
  const user = useSelector((state: any) => state.user.user);
  const optionsRef = useRef(null);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, []);

  const handleClickOutside = (event: any) => {
    if (optionsRef.current && !((optionsRef.current! as any).contains(event.target))) {
      changeState(false);
    }
  };

  const logout = () => {
    changeState(false);
    localStorage.removeItem('username');
    localStorage.removeItem('userId');
    window.location.reload();
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.settings}>
        <div onClick={() => {
          changeState(prevState => !prevState);
        }}>
          <SettingsSvg/>
        </div>
        {
          isOpen &&
                    <div ref={optionsRef} className={styles.options}>
                      <div onClick={logout} className={styles.optionsItem}>Log out</div>
                    </div>
        }

      </div>
      <div className={styles.personalInfo}>
        {
          user.username && (
            <div>
              <div style={{backgroundColor: user.color}} className={styles.personalImg}>
                {user.username?.charAt(0).toUpperCase()}
              </div>
              <div className={styles.name}>
                {user.username}
              </div>
            </div>
          )
        }
      </div>
      <div className={styles.chatList}>
        <ChatInfoList/>
      </div>
    </div>
  );
};

export default UserInfo;
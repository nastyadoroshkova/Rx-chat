import React from "react";

import ChatInfoList from "../chatList/ChatInfoList";

import styles from './UserInfo.module.scss';
import {useSelector} from "react-redux";
import {LogoutSvg} from "../../../../assets/svg";

const UserInfo: React.FC = () => {
    const user = useSelector((state: any) => state.user.user);

    const logout = () => {
        localStorage.removeItem('username');
        localStorage.removeItem('userId');
        window.location.reload();
    }

    return (
        <div className={styles.wrapper}>
            <div className={styles.options}>
                <a onClick={logout}>
                    <LogoutSvg/>
                </a>
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
}

export default UserInfo;
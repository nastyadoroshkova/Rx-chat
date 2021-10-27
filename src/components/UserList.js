import React from 'react';
import {useSelector} from "react-redux";

export default () => {
  const users = useSelector((state) => state.app.users);
  return (
    <div>
      {users.map((item) => {
        return (
          <div className="chatbox-users_area">
            <div className="chatbox-users_box">
              <div className="chatbox-users_user">
                <div className="chatbox-users_username">{item.username}</div>
                <div className="chatbox-users_message">Message ...</div>
              </div>
              <div className="chatbox-users_time">
                11:25
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
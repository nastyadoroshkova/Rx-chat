import React from 'react';
import {useSelector} from "react-redux";

const UserList = () => {
  const users = useSelector((state) => state.app.users);
  return (
    <div>
      {users.map((item) => {
        return (
          <div key={item.id} className="chatbox-users_area">
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

export default UserList;
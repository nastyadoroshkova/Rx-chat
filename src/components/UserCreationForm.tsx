import React, {useRef, useState, useEffect} from 'react';
import {startSession} from "../store/actions/appActions";
import {useDispatch} from "react-redux";

const UserCreationForm:React.FC = () => {
  const [username, setUserName] = useState('');
  const dispatch = useDispatch();
  const usernameInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameInput.current!.focus();
  }, [])

  const start = () => {
    if (username !== '') {
      dispatch(startSession(username))
    }
  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      start();
    }
  }

  return (
    <div className="creation-form">
      <div className="creation-form_title">
        Welcome to <span className="creation-form_title-span">Green.</span> chat!
      </div>
      <div className="creation-form_box">
        <div className="creation-form_form">
          <div className="creation-form_username">
            <input
              ref={usernameInput}
              className="creation-form_input"
              placeholder="Enter your name"
              name="username"
              onKeyDown={handleKeyDown}
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <button type="submit" className="creation-form_button" onClick={start}>
            Join
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserCreationForm;
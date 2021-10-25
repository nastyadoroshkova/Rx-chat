import React, {useRef, useState, useEffect} from 'react';
import { useDispatch } from "react-redux";
import {startSession} from "../redux/actions";

export default () => {
  const [username, setUserName] = useState('');
  const dispatch = useDispatch();
  const usernameInput = useRef();

  useEffect(() => {
    usernameInput.current.focus();
  }, [])

  const start = () => {
    if (username !== '') {
      dispatch(startSession(username))
    }
  }

  const handleKeyDown = (event) => {
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
            Start
          </button>
        </div>
      </div>
    </div>
  );
}
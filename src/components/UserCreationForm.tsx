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
      <div className="header">
        <div className="logo"><span className="creation-form_title-span">Green.</span></div>
        <div className="navigation">
          <a href='/#' className="navigation-item">Product</a>
          <a href='/#' className="navigation-item">About</a>
          <a href='/#' className="navigation-item">Contacts</a>
        </div>
        <div className="login-btns">
          <button>Sign Up</button>
        </div>
      </div>
      <div className="creation-form-body">
        <div className="creation-form-left">
          <div className="creation-form_title">
            Let's chat together
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
                Login
              </button>
            </div>
          </div>
        </div>
        <div className="creation-form-rigth">
          <img className="creation-form-image" src={process.env.PUBLIC_URL + "/images/iphone-image.png"}/>
        </div>
      </div>
    </div>
  );
}

export default UserCreationForm;
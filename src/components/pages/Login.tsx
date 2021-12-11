import React, {useRef, useState, useEffect} from 'react';

import {useDispatch} from "react-redux";

import {navigationMenu} from "../../constants";
import {startSession} from "../../store/actions/appActions";

import {Link, useNavigate} from "react-router-dom";

import styles from './Login.module.scss';

const Login:React.FC = () => {
  const [username, setUserName] = useState('');
  const usernameInput = useRef<HTMLInputElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    usernameInput.current!.focus();
  }, [])

  const start = () => {
    if (username !== '') {
      dispatch(startSession(username, () => navigate("/")))
    }
  }

  const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      start();
    }
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.logo}>
          Green.
        </div>
        <div className={styles.navigation}>
          {
            navigationMenu.map((item) => {
              return (<Link to={item.url} key={item.title} className={styles.navigationItem}>{item.title}</Link>)
            })
          }
        </div>
        <div className={styles.btnRow}>
          <button>Sign Up</button>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.left}>
          <div className={styles.title}>
            Let's chat together
          </div>
          <div className={styles.inputForm}>
            <div className={styles.inputWrapper}>
                <input
                    ref={usernameInput}
                    className={styles.input}
                    placeholder="Enter your name"
                    name="username"
                    onKeyDown={handleKeyDown}
                    value={username}
                    onChange={(e) => setUserName(e.target.value)}
                />
                <button type="submit" className={styles.loginBtn} onClick={start}>
                  Login
                </button>
            </div>
          </div>
        </div>
        <div className={styles.right}>
          <img alt='image' className={styles.mainImg} src={process.env.PUBLIC_URL + "/images/iphone-image.png"}/>
        </div>
      </div>
    </div>
  );
}

export default Login;
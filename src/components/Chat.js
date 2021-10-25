import React, {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMessage, startSession} from "../redux/actions";
import { RiUserLine } from "react-icons/ri"

export default () => {
  const dispatch = useDispatch();
  const messageInput = useRef(null);
  const [message, setMessage] = useState('');
  const messages = useSelector((state) => state.app.messages);

  useEffect(() => {
    messageInput.current.focus();
  }, []);

  const onChange = event => {
    setMessage(event.target.value);
  }

  const send = () => {
    if (message !== '') {
      dispatch(sendMessage(message));
      setMessage('')
    }
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      send();
    }
  }

  return (
    <div className="chatbox">
      <div className="chatbox-messages">
        {messages.map((item) => {
          return (
            <div className="chatbox-messages_area">
              <div className="chatbox-messages_user">
                <div>{item.username}</div>
              </div>
              <div className="chatbox-messages_message" key={item.message.length}>
                <div>{item.message} </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chatbox-inputarea">
        <input
          ref={messageInput}
          type="text"
          name="message"
          onKeyDown={handleKeyDown}
          value={message}
          onChange={onChange}
        />
        <button className="chatbox-inputarea_button" onClick={send}>
          Send message
        </button>
      </div>
    </div>
  );
}
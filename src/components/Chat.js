import React, {useState, useEffect, useRef} from "react";
import {useDispatch, useSelector} from "react-redux";
import {sendMessage} from "../redux/actions";

const Chat = () => {
  const dispatch = useDispatch();
  const messageInput = useRef(null);
  const [message, setMessage] = useState('');
  const messages = useSelector((state) => state.app.messages);
  const user = useSelector((state) => state.app.user);

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
      <div className="chatbox_wrapper">
        <div className="chatbox-messages">
          {messages.map((item) => {
            return (
              <div key={Math.random().toString()} className={"chatbox-messages_area"}>
                <div>
                  {
                    item.user ? (
                      <div className="chatbox-messages_user">
                        <div style={{color: item.user.color}}>{user.username !== item.user.username ? item.user.username : "You"}</div>
                      </div>
                    ) : null
                  }
                  <div className="chatbox-messages_message" key={item.message.length}>
                    <div>{item.message} </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="chatbox-inputarea">
        <textarea
          ref={messageInput}
          name="message"
          placeholder="Write a message ..."
          onKeyDown={handleKeyDown}
          value={message}
          onChange={onChange}
          data-gramm="false"
        />
        <button className="chatbox-inputarea_button" onClick={send}>
          Send
        </button>
      </div>
    </div>
  );
}

export default Chat;
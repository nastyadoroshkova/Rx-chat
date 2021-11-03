import React, {useEffect, useRef} from "react";

import TextareaAutosize from 'react-textarea-autosize';

import {sendMessage} from "store/actions";
import {SendSvg} from 'assets/svg';
import {EmojiSvg} from 'assets/svg';

import styles from './InputPanel.module.scss';
import {useDispatch} from "react-redux";

const InputPanel:React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const dispatch = useDispatch();

  useEffect(() => {
    inputRef.current!.focus();
  }, []);

  const handleKeyDown = (e:React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  const send = () => {
    const message = inputRef.current!.value.trim();
    if (message !== '') {
      dispatch(sendMessage(message));
      inputRef.current!.value = '';
    }
  }

  return (
    <div>
      <div className={styles.box}>
        <TextareaAutosize
          ref={inputRef}
          maxRows={10}
          onKeyDown={handleKeyDown}
          className={styles.textarea}
          placeholder="Write a message ..."
          data-gramm="false"
        />
        <div className={styles.btnRow}>
          <button className={styles.button}><EmojiSvg/></button>
          <button className={styles.button} onClick={send}><SendSvg/></button>
        </div>
      </div>
    </div>
  );
}

export default InputPanel;
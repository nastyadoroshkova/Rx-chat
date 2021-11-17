import React, {useEffect, useRef, useState} from "react";

import TextareaAutosize from 'react-textarea-autosize';

import {sendMessage} from "store/actions";
import {SendSvg} from 'assets/svg';
import {EmojiSvg} from 'assets/svg';

import styles from './InputPanel.module.scss';
import {useDispatch} from "react-redux";

import Picker from 'emoji-picker-react';

const InputPanel:React.FC = () => {
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const pickerRef = useRef<any>(null);
  const dispatch = useDispatch();
  const [emoji, showEmoji] = useState(false);

  useEffect(() => {
    inputRef.current!.focus();
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    }
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

  const onEmojiClick = (event:any, emojiObject:any) => {
    inputRef.current!.value += emojiObject.emoji;
  };

  const handleEmojiBtnCLick = () => showEmoji(prevState => !prevState);

  const handleClickOutside = (event:any) => {
    if (pickerRef.current && !pickerRef.current.contains(event.target)) {
      showEmoji(false);
    }
  };

  return (
    <div>
      {
        emoji && (
          <div ref={pickerRef} className={styles.picker}>
            <Picker onEmojiClick={onEmojiClick} />
          </div>
        )
      }
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
          <button onClick={handleEmojiBtnCLick} className={styles.button}><EmojiSvg/></button>
          <button className={styles.button} onClick={send}><SendSvg/></button>
        </div>
      </div>
    </div>
  );
}

export default InputPanel;
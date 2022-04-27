import React, {useEffect, useRef, useState} from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import Picker from 'emoji-picker-react';

import {useDispatch} from 'react-redux';

import {sendMessage} from '../../../../store/actions/messageActions';
import {SendSvg} from '../../../../assets/svg';
import {EmojiSvg} from '../../../../assets/svg';

import styles from './InputPanel.module.scss';

const InputPanel:React.FC = () => {
  const [isOpenEmoji, toggleEmoji] = useState(false);
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
  };

  const send = () => {
    const message = inputRef.current!.value.trim();
    if (message !== '') {
      dispatch(sendMessage(message));
      inputRef.current!.value = '';
    }
  };

  const onChangeEmoji = () => {
    toggleEmoji((prevState) => (!prevState));
  };

  const onEmojiClick = (event:any, emojiObject:any) => {
    inputRef.current!.value += emojiObject.emoji;
  };

  return (
    <div>
      <div className={styles.box}>
        {
          isOpenEmoji &&
            <div className={styles.picker}>
              <Picker onEmojiClick={onEmojiClick} />
            </div>
        }
        <TextareaAutosize
          ref={inputRef}
          maxRows={10}
          onKeyDown={handleKeyDown}
          className={styles.textarea}
          placeholder="Write a message ..."
          data-gramm="false"
        />
        <div className={styles.btnRow}>
          <button className={styles.button} onClick={onChangeEmoji}><EmojiSvg/></button>
          <button className={styles.button} onClick={send}><SendSvg/></button>
        </div>
      </div>
    </div>
  );
};

export default InputPanel;
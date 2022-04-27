import React, {useEffect, useRef, useState} from 'react';


import {useDispatch, useSelector} from 'react-redux';
import {filter, fromEvent, map} from 'rxjs';

import {IMessage} from '../../../interfaces';

import {loadHistory} from '../../../store/actions/chatActions';

import styles from './MessageList.module.scss';
import Message from './message/Message';

const MessageList: React.FC = () => {
  const chatHistory = useSelector((state: any) => state.app.chatHistory);
  const total = useSelector((state: any) => state.app.total);
  const scrollableArea: any = useRef(null);

  const [scrollSettings, setScrollSettings] = useState(816);

  const dispatch = useDispatch();

  useEffect(() => {
    if (scrollableArea) {
      scrollableArea.current.addEventListener('DOMNodeInserted', (event: any) => {
        const {currentTarget: target} = event;
        target.scroll({top: target.scrollHeight, behavior: 'instant'});
      });
    }
  }, []);

  const scrollCallback = () => {
    scrollableArea.current.scrollTo({
      top: scrollableArea.current.scrollHeight - scrollSettings,
      behavior: 'instant',
    });
    setScrollSettings(scrollableArea.current.scrollHeight);
  };

  useEffect(() => {
    const source = fromEvent(scrollableArea.current, 'scroll')
      .pipe(
        map((el: any) => el.currentTarget.scrollTop),
        filter((el: number) => el === 0),
        filter(() => (chatHistory.length !== 0 && total > chatHistory.length)),
      )
      .subscribe(() => dispatch(loadHistory(scrollCallback)));
    return (() => {
      source.unsubscribe();
    });
  });

  const FormattedMessageList = () => {
    let prevUserId = -1;
    return chatHistory.map((item: IMessage) => {
      const isGroupMessages = prevUserId === item.userId;
      prevUserId = item.userId;
      return (
        <Message key={item.id} isGroup={isGroupMessages} item={item}/>
      );
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        <div ref={scrollableArea} className={styles.scrollable}>
          <FormattedMessageList/>
        </div>
      </div>
    </div>
  );
};

export default MessageList;
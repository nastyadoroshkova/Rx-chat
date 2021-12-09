import React, {useEffect, useRef, useState} from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {IChat, IMessage} from "../../../interfaces";
import {useDispatch, useSelector} from "react-redux";
import {distinctUntilChanged, filter, fromEvent, map, mergeMap, tap} from "rxjs";
import {MESSAGE_HISTORY_ROUTE} from "../../../store/actions/routes";
import {UPDATE_CHAT_HISTORY, UPDATE_TOTAL} from "../../../store/actionTypes";

const MessageList:React.FC = () => {
  const chatHistory = useSelector((state:any) => state.app.chatHistory);
  const total = useSelector((state:any) => state.app.total);
  const rsocket = useSelector((state:any) => state.app.rsocket);
  const currentChat:IChat = useSelector((state:any) => state.app.currentChat);
  const scrollableArea:any = useRef(null);

  const [scrollSettings, setScrollSettings] = useState(816);

  const dispatch = useDispatch();

    useEffect(() => {
        if (scrollableArea) {
            scrollableArea.current.addEventListener('DOMNodeInserted', (event:any) => {
                const { currentTarget: target } = event;
                target.scroll({ top: target.scrollHeight, behavior: 'instant' });
            });
        }
    }, [])

  const getData = () => {
    const id = currentChat.id;
    const time = chatHistory[0].created;
    const limit = 10;
    scrollableArea.current.style.overflow = "hidden";
    console.log('getData time', time, 'chat', currentChat.id);
    return rsocket.simpleRequestResponse(MESSAGE_HISTORY_ROUTE, { chatId: id, from: time, limit});
  }


  useEffect(() => {
    fromEvent(scrollableArea.current, 'scroll')
        .pipe(
            map((el: any) => el.currentTarget.scrollTop),
            filter((el:number) => el === 0),
            filter(() => (chatHistory.length !== 0 && total > chatHistory.length)),
            distinctUntilChanged(),
            mergeMap(() => getData()),
            distinctUntilChanged(),
            tap(({total, list}: any) => {
                dispatch({type: UPDATE_TOTAL, payload: total});
                let all = [...list, ...chatHistory]
                all = all.sort((a, b) => a.id - b.id)
                dispatch({type: UPDATE_CHAT_HISTORY, payload: all});
                scrollableArea.current.style.overflow = "scroll";
                scrollableArea.current.scrollTo({top: scrollableArea.current.scrollHeight - scrollSettings, behavior: 'instant' });
                setScrollSettings(scrollableArea.current.scrollHeight);
            }),
        )
        .subscribe();
  })

  return (
    <div className={styles.wrapper}>
      <div className={styles.messages}>
        <div ref={scrollableArea} className={styles.scrollable}>
          {chatHistory.map((item:IMessage) =>
            <Message key={item.id} item={item}/>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageList;
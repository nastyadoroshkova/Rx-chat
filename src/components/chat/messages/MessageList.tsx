import React, {useEffect, useRef, useState} from "react";
import Message from "./message/Message";

import styles from './MessageList.module.scss';
import {IMessage} from "../../../interfaces";
import {useDispatch, useSelector} from "react-redux";
import {filter, fromEvent, map} from "rxjs";

import {loadHistory} from "../../../store/actions/chatActions";

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
    }, [])

    const scrollCallback = () => {
        scrollableArea.current.scrollTo({
            top: scrollableArea.current.scrollHeight - scrollSettings,
            behavior: 'instant'
        });
        setScrollSettings(scrollableArea.current.scrollHeight);
    }

    useEffect(() => {
        const source = fromEvent(scrollableArea.current, 'scroll')
            .pipe(
                map((el: any) => el.currentTarget.scrollTop),
                filter((el: number) => el === 0),
                filter(() => (chatHistory.length !== 0 && total > chatHistory.length)),
            )
            .subscribe(() => dispatch(loadHistory(scrollCallback)));
        return (() => {
            source.unsubscribe()
        });
    })

    return (
        <div className={styles.wrapper}>
            <div className={styles.messages}>
                <div ref={scrollableArea} className={styles.scrollable}>
                    {chatHistory.map((item: IMessage) =>
                        <Message key={item.id} item={item}/>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MessageList;
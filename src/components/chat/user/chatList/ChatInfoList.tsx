import React from "react";
import {useSelector} from "react-redux";
import ChatInfo from "./ChatInfo";
import {IChat} from "../../../../interfaces";

const ChatInfoList:React.FC = () => {
  const chats = useSelector((state:any) => state.app.chats);
  return chats.map((item:IChat) => <ChatInfo key={item.id} item={item}/>);
}

export default ChatInfoList;
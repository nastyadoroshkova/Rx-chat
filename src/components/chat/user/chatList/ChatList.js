import React from "react";
import {useSelector} from "react-redux";
import SingleChat from "./SingleChat";

const ChatList = () => {
  const users = useSelector((state) => state.app.users);
  return users.map((item) => <SingleChat key={item.id} item={item}/>);
}

export default ChatList;
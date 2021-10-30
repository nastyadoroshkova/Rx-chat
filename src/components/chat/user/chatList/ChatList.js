import React from "react";
import {useSelector} from "react-redux";
import SingleUser from "./SingleUser";

const ChatList = () => {
  const users = useSelector((state) => state.app.users);
  return users.map((item) => <SingleUser key={item.id} item={item}/>);
}

export default ChatList;
import React from "react";
import SingleUser from "./SingleUser";
import {useSelector} from "react-redux";

const ChatList:React.FC = () => {
  const users = useSelector((state:any) => state.user.users);
  return users.map((item:any) => <SingleUser key={item.id} item={item}/>);
}

export default ChatList;
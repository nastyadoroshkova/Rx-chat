import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import ChatInfo from "./ChatInfo";
import {IChat, IUser} from "../../../../interfaces";
import {searchUser} from "../../../../store/actions/userActions";
import UserInfo from "./UserInfo";
import {SearchSvg, CrossSvg} from '../../../../assets/svg';

import styles from './ChatInfoList.module.scss';
import Options from "./Options";

const ChatInfoList:React.FC = () => {
  const chats = useSelector((state:any) => state.app.chats);
  const userSearch = useSelector((state:any) => state.app.userSearch);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');

  const handleChange = (e:any) => {
    setSearch(e.target.value);
    dispatch(searchUser(e.target.value));
  }

  const clearSearch = () => {
    if(search.length) {
      setSearch('');
    }
  }

  return (
    <div>
      <div className={styles.inputWrapper}>
        <input placeholder="Search ..." className={styles.input} value={search} onChange={handleChange}/>
        <a onClick={clearSearch} className={styles.action}>
          { search.length ? <CrossSvg /> : <SearchSvg/> }
        </a>
      </div>
        {
            !search.length && (
                <div className={styles.panel}>
                    <div className={styles.panelTitle}>Last chats</div>
                    <div className={styles.panelIcons}>
                      <Options/>
                    </div>
                </div>
            )
        }
      <div className={styles.list}>
        {
          search.length ?
            userSearch.map((item:IUser) => <UserInfo key={item.id} item={item}/>)
            : chats.map((item:IChat) => <ChatInfo key={item.id} item={item}/>)
        }
      </div>
    </div>
  );
}

export default ChatInfoList;
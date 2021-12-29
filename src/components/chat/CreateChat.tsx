import React, {useEffect, useRef, useState} from 'react';

import styles from './CreateChat.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {IS_CREATE_GROUP_CHAT} from "../../store/actionTypes";
import {IUser} from "../../interfaces";
import {CrossSvg, SearchSvg} from "../../assets/svg";
import {getFriends, searchFriends} from "../../store/actions/userActions";
import UserRadioItem from "./UserRadioItem";
import {createGroupChat} from "../../store/actions/chatActions";

const CreateChat:React.FC = () => {
    const createAreaRef = useRef(null);
    let friends = useSelector((state:any) => state.user.searchFriends);
    const dispatch = useDispatch();
    const [search, setSearch] = useState('');
    const [groupName, setGroupName] = useState('');

    const initialState:number[] = [];

    const [selectedUsers, setSelectedUsers] = useState(initialState);

    useEffect(() => {
        dispatch(getFriends());
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (event: any) => {
        if (createAreaRef.current && !((createAreaRef.current! as any).contains(event.target))) {
            dispatch({type: IS_CREATE_GROUP_CHAT, payload: false});
        }
    }

    const clearSearch = () => {
        dispatch(searchFriends(''));
        setSearch('');
    }

    const handleChange = (e:any) => {
        setSearch(e.target.value);
        dispatch(searchFriends(e.target.value));
    }

    const closeWindow = () => {
        dispatch({type: IS_CREATE_GROUP_CHAT, payload: false});
    }

    const handleSelectUser = (item:IUser) => {
        setSelectedUsers([...selectedUsers, item.id]);
    }

    const handleRemoveUser = (item:IUser) => {
        const newArray = [...selectedUsers];
        const index = newArray.indexOf(item.id);
        if(index > -1) {
            newArray.splice(index, 1);
        }
        setSelectedUsers([...newArray]);
    }

    const createChat = () => {
        if(groupName.trim() !== '' && selectedUsers.length) {
            dispatch(createGroupChat(groupName, selectedUsers))
        }
    }

  return(
      <div ref={createAreaRef} className={styles.wrapper}>
          <div className={styles.panel}>
              <div className={styles.linkRow}>
                  <div onClick={closeWindow} className={styles.link}>Back</div>
                  <div onClick={createChat} className={styles.link}>Create</div>
              </div>
              <div className={styles.groupName}>
                  <div className={styles.groupTitle}>Group Name:</div>
                  <div className={styles.inputGroupNameWrapper}>
                      <input value={groupName} onChange={(e) => setGroupName(e.target.value)} className={styles.inputGroupName}/>
                  </div>
              </div>
              <div>
                  <div className={styles.groupTitle}>Users:</div>
                  <div className={styles.selectedUsers}>
                      {
                          selectedUsers.map((item) => {
                              return (
                                  <div className={styles.selectedItem}>{item}</div>
                              );
                          })
                      }
                  </div>
                  <div className={styles.inputWrapper}>
                      <input placeholder="Who would you like to add?" className={styles.input} value={search} onChange={handleChange}/>
                      <a onClick={clearSearch} className={styles.action}>
                          { search.length ? <CrossSvg /> : <SearchSvg/> }
                      </a>
                  </div>
                  <div className={styles.list}>
                      {
                          friends.length ?
                          friends.map((item:IUser) => <UserRadioItem onSelect={handleSelectUser} onRemove={handleRemoveUser} key={item.id} item={item}/>)
                          : <div className={styles.notFound}>Friends not found</div>
                      }
                  </div>
              </div>
          </div>
      </div>
  );
}

export default CreateChat;
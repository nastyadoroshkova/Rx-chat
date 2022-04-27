import React, {useEffect, useRef, useState} from 'react';

import {useDispatch, useSelector} from 'react-redux';

import {IS_CREATE_GROUP_CHAT} from '../../store/actionTypes';
import {IUser} from '../../interfaces';
import {CrossSvgV2, CrossSvg, SearchSvg} from '../../assets/svg';
import {getFriends, searchFriends} from '../../store/actions/userActions';

import {createGroupChat} from '../../store/actions/chatActions';

import UserRadioItem from './UserRadioItem';
import styles from './CreateChat.module.scss';

const CreateChat:React.FC = () => {
  const createAreaRef = useRef(null);
  const friends = useSelector((state:any) => state.user.searchFriends);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [groupName, setGroupName] = useState('');

  const initialState:IUser[] = [];

  const [selectedUsers, setSelectedUsers] = useState(initialState);

  const handleClickOutside = (event: any) => {
    if (createAreaRef.current && !((createAreaRef.current! as any).contains(event.target))) {
      dispatch({type: IS_CREATE_GROUP_CHAT, payload: false});
    }
  };

  useEffect(() => {
    dispatch(getFriends());
    document.addEventListener('click', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
    };
  }, [dispatch]);

  const clearSearch = () => {
    dispatch(searchFriends(''));
    setSearch('');
  };

  const handleChange = (e:any) => {
    setSearch(e.target.value);
    dispatch(searchFriends(e.target.value));
  };

  const closeWindow = () => {
    dispatch({type: IS_CREATE_GROUP_CHAT, payload: false});
  };

  const handleSelectUser = (item:IUser) => {
    setSelectedUsers([...selectedUsers, item]);
  };

  const handleRemoveUser = (item:IUser) => {
    const newArray = [...selectedUsers];
    const index = newArray.findIndex(i => i.id === item.id);
    if(index > -1) {
      newArray.splice(index, 1);
    }
    setSelectedUsers([...newArray]);
  };

  const createChat = () => {
    if(groupName.trim() !== '' && selectedUsers.length) {
      dispatch(createGroupChat(groupName, selectedUsers.map(i => i.id)));
    }
  };

  return(
    <div ref={createAreaRef} className={styles.wrapper}>
      <div className={styles.panel}>
        <div className={styles.linkRow}>
          <div onClick={closeWindow} className={styles.link}>Back</div>
          <div className={styles.title}>Create new group</div>
          <div
            onClick={createChat}
            className={(groupName.trim() !== '' && selectedUsers.length) ? styles.link : styles.notActiveLink}
          >
                      Create
          </div>
        </div>
        <div className={styles.groupName}>
          <div className={styles.groupTitle}>Group Name:</div>
          <div className={styles.inputGroupNameWrapper}>
            <input
              value={groupName}
              maxLength={140}
              onChange={(e) => setGroupName(e.target.value)}
              className={styles.inputGroupName}
            />
          </div>
        </div>
        <div>
          <div className={styles.groupTitle}>Users:</div>
          <div className={styles.selectedUsers}>
            {
              selectedUsers.length > 0 ?
                selectedUsers.map((item) => {
                  return (
                    <div key={item.id} className={styles.selectedItem}>
                      <div className={styles.selectedItemName}>{item.username}</div>
                      <button onClick={() => handleRemoveUser(item)} className={styles.selectedItemRemove}>
                        <CrossSvgV2/>
                      </button>
                    </div>
                  );
                })
                : <div className={styles.notFound}>No selected users</div>
            }
          </div>
          <div className={styles.inputWrapper}>
            <input
              placeholder="Who would you like to add?"
              className={styles.input}
              value={search}
              onChange={handleChange}
            />
            <button onClick={clearSearch} className={styles.action}>
              { search.length ? <CrossSvg /> : <SearchSvg/> }
            </button>
          </div>
          <div className={styles.list}>
            {
              friends.length ?
                friends.map((item:IUser) =>
                  <UserRadioItem
                    key={item.id}
                    item={item}
                    selectedItems={selectedUsers}
                    onSelect={handleSelectUser}
                    onRemove={handleRemoveUser}
                  />,
                )
                : <div className={styles.notFound}>Friends not found</div>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateChat;
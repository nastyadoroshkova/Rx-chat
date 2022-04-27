import React from 'react';

import {IUser} from '../../interfaces';

import styles from './UserRadioItem.module.scss';

type PropsType = {
    item: IUser,
    onSelect: Function,
    onRemove: Function,
    selectedItems: Array<IUser>,
}

const UserRadioItem:React.FC<PropsType> = ({item, selectedItems, onSelect, onRemove}) => {
  const isSelected = selectedItems.findIndex(i => i.id === item.id) > -1;

  return (
    <div onClick={() => !isSelected ? onSelect(item) : onRemove(item)} className={styles.wrapper}>
      <div className={styles.checkBoxContainer}>
        <input onChange={() => {}} className={styles.checkbox} checked={isSelected} type="checkbox"/>
        <span className={styles.checkmark}/>
      </div>
      <div style={{backgroundColor: item.color}} className={styles.userImg}>
        {item.username?.charAt(0).toUpperCase()}
      </div>
      <div className={styles.userInfo}>
        <div className={styles.name}>{item.username}</div>
        <div className={styles.lastSeen}>Last seen: 14:21</div>
      </div>
    </div>
  );
};

export default UserRadioItem;
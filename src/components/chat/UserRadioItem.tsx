import React, {useState} from "react";

import {IUser} from "../../interfaces";
import styles from "./UserRadioItem.module.scss";

type PropsType = {
    item: IUser,
    onSelect: Function,
    onRemove: Function,
}

const UserRadioItem:React.FC<PropsType> = ({item, onSelect, onRemove}) => {
    const [isSelected, toggleSelect] = useState(false);

    const handleClick = () => {
        toggleSelect((prevState => {
            !prevState ? onSelect(item) : onRemove(item);
            return !prevState;
        }));
    }

    return (
        <div onClick={handleClick} className={styles.wrapper}>
            <div style={{backgroundColor: item.color}} className={styles.userImg}>
                {item.username?.charAt(0).toUpperCase()}
            </div>
            <div className={styles.userInfo}>
                <div className={styles.name}>{item.username}</div>
                <div className={styles.lastSeen}>Last seen: 14:21</div>
            </div>
            <div onClick={() => toggleSelect((prevState => !prevState))} className={styles.checkBoxContainer}>
                <input onChange={() => {}} className={styles.checkbox} checked={isSelected} type="checkbox"/>
                <span className={styles.checkmark}/>
            </div>
        </div>
    );
}

export default UserRadioItem;
import styles from "./Options.module.scss";
import React, {useEffect, useRef, useState} from "react";
import {OptionsSvg} from '../../../../assets/svg';
import {useDispatch} from "react-redux";
import {IS_CREATE_GROUP_CHAT} from "../../../../store/actionTypes";

const Options: React.FC = () => {
    const [isOpen, changeState] = useState(false);
    const optionsRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (event: any) => {
        if (optionsRef.current && !((optionsRef.current! as any).contains(event.target))) {
            changeState(false);
        }
    }

    const createGroup = () => {
        changeState(false);
        dispatch({type: IS_CREATE_GROUP_CHAT, payload: true});
    }

    return (
        <div className={styles.wrapper}>
            <div onClick={() => {
                changeState(prevState => !prevState);
            }}>
                <OptionsSvg/>
            </div>
            {
                isOpen &&
                <div ref={optionsRef} className={styles.options}>
                  <div onClick={createGroup} className={styles.optionsItem}>Create group chat</div>
                </div>
            }

        </div>
    );
}

export default Options;
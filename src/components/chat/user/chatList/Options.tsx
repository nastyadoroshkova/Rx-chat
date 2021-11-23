import styles from "./Options.module.scss";
import React, {useEffect, useRef, useState} from "react";
import {OptionsSvg} from '../../../../assets/svg';

const Options:React.FC = () => {
    const [isOpen, changeState] = useState(false);
    const optionsRef = useRef(null);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (event:any) => {
        if (optionsRef.current && !((optionsRef.current! as any).contains(event.target))) {
            changeState(false);
        }
    }

    return(
        <div className={styles.wrapper}>
            <div onClick={()=>{changeState(prevState => !prevState);}}>
                <OptionsSvg />
            </div>
            {
                isOpen &&
                <div ref={optionsRef} className={styles.options}>
                  <div className={styles.optionsItem}>Create group chat</div>
                </div>
            }

        </div>
    );
}

export default Options;
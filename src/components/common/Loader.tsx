import React from "react";

import Spinner from '../../assets/loader.gif';
import styles from './Loader.module.scss';

type PropType = {
    isLoading: boolean
}

const Loader = ({isLoading}:PropType) => {
    if(isLoading) {
        return (
            <div className={styles.wrapper}>
                <img className={styles.loader} alt="Loading..." src={Spinner} />
            </div>
        );
    }
    return <div/>;

}

export default Loader;
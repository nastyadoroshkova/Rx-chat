import {useDispatch} from 'react-redux';

import {AddSvg} from '../../../../assets/svg';
import {IS_CREATE_GROUP_CHAT} from '../../../../store/actionTypes';

import styles from './Options.module.scss';

const Options: React.FC = () => {
  // const [isOpen, changeState] = useState(false);
  // const optionsRef = useRef(null);
  const dispatch = useDispatch();

  // useEffect(() => {
  //     document.addEventListener('click', handleClickOutside, true);
  //     return () => {
  //         document.removeEventListener('click', handleClickOutside, true);
  //     };
  // }, []);

  // const handleClickOutside = (event: any) => {
  //     if (optionsRef.current && !((optionsRef.current! as any).contains(event.target))) {
  //         changeState(false);
  //     }
  // }

  const createGroup = () => {
    // changeState(false);
    dispatch({type: IS_CREATE_GROUP_CHAT, payload: true});
  };

  return (
    <div className={styles.wrapper}>
      <button title={'New group'} className={styles.add} onClick={createGroup}>
        <AddSvg/>
      </button>
    </div>
  );
};

export default Options;
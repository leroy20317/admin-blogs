import React from 'react';
import styles from './index.less';

type Props = {
  currentUser?: API.CurrentUser;
};

const MenuHeader = ({ currentUser }: Props) => {
  return (
    <div className={styles.info}>
      <div className={styles.photo}>
        <img src={currentUser?.admin.avatar} />
      </div>
      <p className={styles.name}>{currentUser?.admin.name}</p>
    </div>
  );
};

export default MenuHeader;

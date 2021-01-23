import React from 'react';
import styles from './index.less'

interface Props {
  currentUser?: API.CurrentUser
}

const MenuHeader = ({ currentUser }: Props) => {
  return (
    <div className={styles.info}>
      <div className={styles.photo}>
        <img src={currentUser?.avatar} />
      </div>
      <p className={styles.name}>{currentUser?.name}</p>
    </div>
  );
}

export default MenuHeader

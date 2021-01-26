import type { FC } from 'react';
import React, { useEffect, useState } from 'react';
import { ChromePicker } from 'react-color';
import styles from './index.less';

type Props = {
  value?: any;
  onChange?: (...agm: any[]) => void;
};

interface Color {
  r: string;
  g: string;
  b: string;
  a: string;
}

const Index: FC<Props> = ({ value, onChange }) => {
  const [isShow, setIsShow] = useState(false);

  const show = () => {
    setIsShow(true);
  };

  const hide = () => {
    setIsShow(false);
  };

  const handleChange = ({ rgb }: { rgb: Color }) => {
    if (onChange) {
      onChange(`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a})`);
    }
  };

  useEffect(() => {
    if (isShow) {
      document.addEventListener('click', hide);
    }

    return () => {
      if (isShow) {
        document.removeEventListener('click', hide);
      }
    };
  }, [isShow]);

  return (
    <div>
      <div className={styles.swatch} onClick={show}>
        <div className={styles.color} style={{ backgroundColor: value }} />
      </div>
      {isShow && (
        <div className={styles.popover} onClick={(e) => e.stopPropagation()}>
          <ChromePicker color={value} onChange={handleChange} />
        </div>
      )}
    </div>
  );
};

export default Index;

import React, { memo, useEffect, useRef, useState } from 'react';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import styles from './index.less';
import url from '@/utils/url';
import { useModel } from 'umi';

interface Props {
  value?: any;
  onChange?: (...agm: any[]) => void;
  height?: number;
  placeholder?: string;
}

const Editor = ({ value, onChange, height, placeholder }: Props) => {
  const { initialState } = useModel('@@initialState');
  const [vditorEditor, setVditor] = useState<any>(null);
  const ref = useRef<any>(null);

  useEffect(() => {
    const { currentUser } = initialState || {};
    const vditor = new Vditor(ref.current, {
      height: height || 420,
      placeholder,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      // after() {
      //   vditor.setValue(value || '');
      // },
      value: value?.val,
      blur: (val) => {
        if (onChange) {
          onChange({ val, html: vditor?.getHTML(), length: val.length });
          // onChange(val);
        }
      },
      preview: {
        delay: 200,
        actions: ['desktop', 'mobile'],
        markdown: {
          autoSpace: true,
          fixTermTypo: true,
          toc: true,
        },
      },
      upload: {
        url: `${url.upload}/${currentUser?.upload_type}`,
        multiple: false,
        accept: 'audio/*,video/*,image/*',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('Authorization')}`,
        },
        fieldName: 'file',
        success: (editor, msg) => {
          const response = JSON.parse(msg);
          if (response.status === 'success') {
            const md = `![${response.body.filename}](${response.body.url})`;
            vditor.insertValue(md);
          }
        },
      },
    });
    setVditor(vditor);

    return () => {
      vditorEditor?.destroy();
    };
  }, []);

  return <div className={styles.editor} ref={ref} />;
};
export default memo(Editor);

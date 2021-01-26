import { message, Upload } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useModel } from 'umi';
import url from '@/utils/url';

interface Props {
  value?: any;
  onChange?: (...agm: any[]) => void;
}

const UploadMusic = ({ value, onChange }: Props) => {
  const getInitList = () => {
    if (!value) return [];
    return [{ status: 'done', response: { body: value }, filename: value.filename }];
  };
  const [fileList, setFileList] = useState<any[]>(getInitList());
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  return (
    <Upload.Dragger
      accept="audio/*"
      name="file"
      multiple={false}
      action={url.upload}
      fileList={fileList}
      beforeUpload={(file: any) => {
        let result = true;
        const { size } = file;
        if (size / 1024 / 1024 > 10) {
          result = false;
          message.error('文件不能超过10M', 1);
        }
        return result;
      }}
      headers={{
        Authorization: `Bearer ${localStorage.getItem('Authorization')}`,
      }}
      data={{
        type: currentUser?.upload_type || '',
      }}
      showUploadList={false}
      onChange={(info) => {
        let list: any = [...info.fileList];
        list = list.slice(-1);
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList);
        // }
        // console.log('onChange', info.file, info.fileList);
        if (info.file.status === 'done') {
          // const { url } = info.file.response;
          const { body } = info.file.response;
          if (onChange) onChange({ ...body, filename: info.file.name });
          // message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
        setFileList(list);
      }}
    >
      <p className="ant-upload-drag-icon">
        <CustomerServiceOutlined />
      </p>
      <p className="ant-upload-text">{fileList?.[0]?.response?.filename || '背景音乐'}</p>
      <p className="ant-upload-hint">Click or drag file to this area to upload.</p>
    </Upload.Dragger>
  );
};

export default UploadMusic;

import { useState } from 'react';
import { Image, message, Upload } from 'antd';
import { LoadingOutlined, PictureOutlined } from '@ant-design/icons';
import ImgCrop from '../ImgCrop';
import { upload } from '@/services/common';

const Img = ({
  status,
  response,
  filename,
}: {
  status: string;
  response: { body: { url: string; filename: string } };
  filename: string;
}) => {
  switch (status) {
    case 'done':
      return <Image src={response.body.url} width="95%" preview={false} />;
    case 'uploading':
      return (
        <>
          <p className="ant-upload-drag-icon">
            <LoadingOutlined />
          </p>
          <p className="ant-upload-text">{filename}</p>
        </>
      );
    default:
      return (
        <>
          <p className="ant-upload-drag-icon">
            <PictureOutlined />
          </p>
          <p className="ant-upload-text">封面图片 (680*440)</p>
          <p className="ant-upload-hint">Click or drag file to this area to upload.</p>
        </>
      );
  }
};

interface Props {
  value?: any;
  onChange?: (...agm: any[]) => void;
}

const UploadImage = ({ value, onChange }: Props) => {
  const getInitList = () => {
    if (!value) return [];
    return [{ status: 'done', response: { body: value }, filename: value.filename }];
  };
  const [fileList, setFileList] = useState<any[]>(getInitList());

  return (
    <ImgCrop
      aspect={680 / 440}
      grid
      modalProps={{
        width: 800,
        centered: true,
      }}
      beforeCrop={(file: any) => {
        let result = true;
        const { size } = file;
        if (size / 1024 / 1024 > 10) {
          result = false;
          message.error('文件不能超过10M', 1);
        }
        return result;
      }}
    >
      <Upload.Dragger
        accept="image/*"
        multiple={false}
        customRequest={async ({ file, onError, onSuccess }) => {
          try {
            const res = await upload({
              type: 'cdn',
              file: file as Blob,
            });
            onSuccess?.(res);
          } catch (e) {
            onError?.(new Error('网络错误'));
          }
          return {
            abort() {
              console.log('upload progress is aborted.');
            },
          };
        }}
        fileList={fileList}
        headers={{
          Authorization: `Bearer ${localStorage.getItem('Authorization')}`,
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
        <Img {...fileList[0]} />
      </Upload.Dragger>
    </ImgCrop>
  );
};

export default UploadImage;

import { FC, useState } from 'react';
import { Image, message, Upload } from 'antd';
import { LoadingOutlined, PictureOutlined, PlusOutlined } from '@ant-design/icons';
import { useModel } from '@umijs/max';
import ImgCrop from '../../components/ImgCrop';
import styles from './index.less';
import { upload } from '@/services/common';
import classNames from 'classnames';
import { useEmotionCss } from '@ant-design/use-emotion-css';

interface ImgProps {
  status: string;
  response: {
    body: {
      url: string;
      filename: string;
    };
  };
  filename: string;
}

const AvatarImg: FC<ImgProps> = ({ status, response }) => {
  switch (status) {
    case 'done':
      return <Image src={response?.body?.url} preview={false} />;
    case 'uploading':
      return <LoadingOutlined />;
    default:
      return <PlusOutlined className={styles.plus} />;
  }
};

const Img: FC<ImgProps> = ({ status, response, filename }) => {
  switch (status) {
    case 'done':
      return <Image src={response.body.url} width="95%" preview={false} />;
    case 'uploading':
      return (
        <div>
          <p className="ant-upload-drag-icon">
            <LoadingOutlined />
          </p>
          <p className="ant-upload-text">{filename}</p>
        </div>
      );
    default:
      return (
        <div>
          <p className="ant-upload-drag-icon">
            <PictureOutlined />
          </p>
          <p className="ant-upload-text">封面图片 (1920*1080)</p>
          <p className="ant-upload-hint">Click or drag file to this area to upload.</p>
        </div>
      );
  }
};

interface Props {
  value?: any;
  onChange?: (...agm: any[]) => void;
  isAvatar?: boolean;
}

const UploadImage = ({ value, onChange, isAvatar }: Props) => {
  const getInitList = () => {
    if (!value) return [];
    return [{ status: 'done', response: { body: value }, filename: value.filename }];
  };
  const [fileList, setFileList] = useState<any[]>(getInitList());
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};

  const hoverPrimaryColor = useEmotionCss(({ token }) => {
    return {
      '&:hover': {
        color: token.colorPrimary,
      },
    };
  });
  const avatarPadding0 = useEmotionCss(() => {
    return {
      ':global(.ant-upload)': {
        padding: 0,
      },
    };
  });
  return (
    <ImgCrop
      grid
      modalProps={{
        width: 800,
        centered: true,
      }}
      aspect={isAvatar ? 1 : 1920 / 1080}
      shape={isAvatar ? 'round' : 'rect'}
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
              type: currentUser?.upload_type,
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
        className={
          isAvatar
            ? classNames(styles.avatar, avatarPadding0)
            : classNames(styles.bg, hoverPrimaryColor)
        }
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
        <div className={styles.box}>
          {isAvatar ? <AvatarImg {...fileList[0]} /> : <Img {...fileList[0]} />}
        </div>
      </Upload.Dragger>
    </ImgCrop>
  );
};

export default UploadImage;

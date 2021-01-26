import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, DatePicker, Form, Input, message, Radio, Row, Col, Tooltip } from 'antd';
import styles from './index.less';
import { postInfo } from '@/services/common';
import { history, useModel } from 'umi';
import UploadImage from './UploadImage';
import ColorPicker from '@/components/ColorPicker';
import { EyeOutlined } from '@ant-design/icons';
import moment from 'moment';

const Setting: React.FC = () => {
  const { initialState, refresh } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const tooltipParent: React.RefObject<any> = useRef();

  useEffect(() => {
    setTimeout(() => {
      const {
        _id: id,
        email,
        bg_music,
        cover,
        upload_type,
        avatar,
        name,
        web_name,
        address,
        web_describe,
        web_seo,
      } = currentUser || {};
      form.setFieldsValue({
        _id: id,
        email,
        bg_music,
        cover: {
          ...cover,
          date: moment(cover?.date),
          image: {
            url: cover?.image,
          },
        },
        upload_type,
        avatar: {
          url: avatar,
        },
        name,
        web_name,
        address,
        web_describe,
        web_seo,
      });
      setLoading(false);
    }, 800);

    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = async ({
    _id: id,
    email,
    bg_music,
    cover,
    upload_type,
    avatar,
    name,
    web_name,
    address,
    web_describe,
    web_seo,
  }: any) => {
    const params = {
      _id: id,
      email,
      bg_music,
      cover: {
        ...cover,
        date: cover.date.format('YYYY-MM-DD HH:mm:ss'),
        image: cover?.image?.url || '',
      },
      upload_type,
      avatar: avatar?.url || '',
      name,
      web_name,
      address,
      web_describe,
      web_seo,
    };

    try {
      setSubmitting(true);
      const response = await postInfo(params);
      if (response.status === 'success') {
        message.success(response.message, 1);
        setTimeout(() => {
          if (refresh) {
            refresh();
          }
          history.push('/home');
        }, 800);
      } else {
        message.error(response.message, 1);
      }
      setTimeout(() => {
        setSubmitting(false);
      }, 800);
    } catch (e) {
      console.log('e', e);
    }
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <PageContainer
      loading={loading}
      className={styles.setting}
      pageHeaderRender={() => (
        <>
          <h2 className={styles.header}>网站信息</h2>
        </>
      )}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        labelCol={{ span: 3 }}
        wrapperCol={{ span: 19 }}
        initialValues={{
          upload_type: '1',
        }}
        validateMessages={{
          // eslint-disable-next-line no-template-curly-in-string
          required: '${label}不能为空',
        }}
      >
        <Form.Item noStyle name="_id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          label="管理头像"
          name="avatar"
          rules={[{ required: true, message: '请选择头像!' }]}
          wrapperCol={{ span: 3 }}
        >
          <UploadImage isAvatar />
        </Form.Item>
        <Form.Item label="管理昵称" name="name" required>
          <Input placeholder="请填写" />
        </Form.Item>
        <Form.Item label="网站昵称" name="web_name" required>
          <Input placeholder="前台网站的网站名" />
        </Form.Item>
        <Form.Item label="网站地址" name="address" required>
          <Input placeholder="网站的域名, 例如 http://baidu.com" />
        </Form.Item>
        <Form.Item label="网站描述" name="web_describe" required>
          <Input placeholder="请填写" />
        </Form.Item>
        <Form.Item label="网站SEO" name="web_seo" required>
          <Input placeholder="SEO关键词" />
        </Form.Item>
        <Form.Item label="文件上传" name="upload_type">
          <Radio.Group>
            <Radio value={'1'}>服务器</Radio>
            <Radio value={'2'}>七牛KODO</Radio>
          </Radio.Group>
        </Form.Item>

        <h2 className={styles.header}>首屏效果</h2>
        <Form.Item
          label="封面图片"
          name={['cover', 'image']}
          rules={[{ required: true, message: '请选择封面图片!' }]}
          wrapperCol={{ span: 12 }}
          tooltip={'1920*1080'}
        >
          <UploadImage />
        </Form.Item>
        <Form.Item label="色调" style={{ marginBottom: 0 }}>
          <Row>
            <Col>
              <Form.Item name={['cover', 'color']} required>
                <ColorPicker />
              </Form.Item>
            </Col>
            <Col style={{ paddingTop: 6, marginLeft: 10 }} ref={tooltipParent}>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, nextValues) => {
                  return (
                    prevValues?.cover?.image.url !== nextValues?.cover?.image.url ||
                    prevValues?.cover?.color !== nextValues?.cover?.color
                  );
                }}
              >
                {() => {
                  const { cover } = form.getFieldsValue() || {};
                  if (!cover?.color && !cover?.image.url) return null;
                  return (
                    <Tooltip
                      color="#fff"
                      overlayClassName={styles.tooltip}
                      getPopupContainer={() => tooltipParent.current}
                      title={
                        <div className={styles.preview}>
                          <div className={styles.mark} style={{ backgroundColor: cover?.color }} />
                          <img src={cover?.image.url} alt="预览" />
                        </div>
                      }
                    >
                      <EyeOutlined className={styles.eye} />
                    </Tooltip>
                  );
                }}
              </Form.Item>
            </Col>
          </Row>
        </Form.Item>
        <Form.Item label="标题" name={['cover', 'title']} required>
          <Input placeholder="首页文章的标题" />
        </Form.Item>
        <Form.Item label="描述" name={['cover', 'describe']} required>
          <Input placeholder="首页文章的描述" />
        </Form.Item>
        <Form.Item label="链接" name={['cover', 'link']} required>
          <Input placeholder="前台首页链接，不填则没有链接功能" />
        </Form.Item>
        <Form.Item label="时间" name={['cover', 'date']} required>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item label="备案号" name={['cover', 'icp']} required>
          <Input placeholder="网站的备案信息" />
        </Form.Item>

        <h2 className={styles.header}>评论信息</h2>
        <Form.Item label="评论邮箱" name={['email', 'address']} required>
          <Input placeholder="管理员评论的邮箱" />
        </Form.Item>
        <Form.Item label="评论昵称" name={['email', 'name']} required>
          <Input placeholder="管理员评论的昵称" />
        </Form.Item>
        <Form.Item label="评论标识" name={['email', 'mark']} required>
          <Input placeholder="前台评论的管理员标识" />
        </Form.Item>

        <h2 className={styles.header}>背景音乐</h2>
        <Form.Item label="文章列表" name={['bg_music', 'mood']} required>
          <Input placeholder="文章列表页面的背景音乐" />
        </Form.Item>
        <Form.Item label="短语列表" name={['bg_music', 'letter']} required>
          <Input placeholder="短语列表页面的背景音乐" />
        </Form.Item>
        <Form.Item label="个人介绍" name={['bg_music', 'about']} required>
          <Input placeholder="个人介绍页面的背景音乐" />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 3 }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ padding: '0 30px' }}
          >
            保存
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default Setting;

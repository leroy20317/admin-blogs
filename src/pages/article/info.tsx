import React, { FC, useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Col, DatePicker, Form, Input, message, Radio, Row, Switch } from 'antd';
import styles from './info.less';
import { history } from 'umi';
import { create, fetch, update } from '@/services/article';
import Editor from '@/components/Editor';
import moment from 'moment';
import UploadImage from '@/components/Upload/UploadImage';
import UploadMusic from '@/components/Upload/UploadMusic';

const ArticleInfo: FC = () => {
  const { id } = history.location.query || {};
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDetail = () => {
    return new Promise((resolve) => {
      setLoading(true);
      fetch({ id })
        .then((res) => {
          if (res.status === 'success') {
            resolve(res.body);
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 100);
        });
    });
  };

  useEffect(() => {
    if (id) {
      getDetail().then((res: any) => {
        form.setFieldsValue({
          title: res?.title,
          editor: {
            val: res?.content,
            html: res?.contentHtml,
            length:res?.words,
          },
          time: res?.time && moment(res.time),
          describe: res?.describe,
          image: res?.image.url
            ? {
                url: res?.image.url || '',
                filename: res?.image.name || '',
              }
            : undefined,
          music: res?.music.url
            ? {
                url: res?.music.url || '',
                filename: res?.music.name || '',
              }
            : undefined,
          isUpload: true,
          hide: res?.hide,
        });
      });
    }

    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = async (values: any) => {
    const params = {
      title: values.title,
      content: values.editor.val,
      contentHtml: values.editor.html,
      words: values.editor.length,
      time: values.time.format('YYYY-MM-DD HH:mm:ss'),
      describe: values.describe,
      image: {
        url: values.image?.url || '',
        name: values.isUpload && values.image ? values.image.filename : '',
      },
      music: {
        url: values.music?.url || '',
        name: values.isUpload && values.music ? values.music.filename : '',
      },
      hide: values.hide,
    };

    console.log(!id ? '创建' : '更新', params);

    try {
      setSubmitting(true);
      const response = !id
        ? await create(params)
        : await update({
            id,
            data: params,
          });
      if (response.status === 'success') {
        message.success(response.message, 1);
        setTimeout(() => {
          history.push('/article');
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
      className={styles.info}
      pageHeaderRender={() => (
        <>
          <h2 className={styles.header}>无人问津的心情，在黑纸白字间游荡！</h2>
        </>
      )}
    >
      <Form
        form={form}
        size="large"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        labelAlign="left"
        initialValues={{
          isUpload: true,
          hide: false,
        }}
      >
        <Form.Item
          label="文章标题"
          name="title"
          rules={[{ required: true, message: '请填写标题!' }]}
        >
          <Input placeholder="请填写标题" />
        </Form.Item>
        <Form.Item
          label="文章内容"
          name="editor"
          rules={[{ required: true, transform: value => value?.html, message: '请填写内容!' }]}
        >
          <Editor />
        </Form.Item>
        <Form.Item
          label="发布时间"
          name="time"
          rules={[{ required: true, message: '请选择发布时间!' }]}
        >
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label="文章摘要"
          name="describe"
          rules={[{ required: true, message: '请填写文章摘要!' }]}
        >
          <Input placeholder="请填写文章摘要" />
        </Form.Item>
        <Form.Item
          label="封面背景"
          shouldUpdate={(prevValues, nextValues) => {
            return prevValues.isUpload !== nextValues.isUpload;
          }}
        >
          {() => (
            <>
              <Form.Item name="isUpload">
                <Radio.Group>
                  <Radio value={true}>文件上传</Radio>
                  <Radio value={false}>输入链接</Radio>
                </Radio.Group>
              </Form.Item>
              {form.getFieldValue('isUpload') ? (
                <Row>
                  <Col span={10}>
                    <Form.Item
                      name="image"
                      noStyle
                      rules={[{ required: true, message: '请选择封面图片!' }]}
                    >
                      <UploadImage />
                    </Form.Item>
                  </Col>
                  <Col span={10} offset={2}>
                    <Form.Item name="music" noStyle>
                      <UploadMusic />
                    </Form.Item>
                  </Col>
                </Row>
              ) : (
                <>
                  <Form.Item
                    label="封面图片"
                    name={['image', 'url']}
                    rules={[{ required: true, message: '请填写封面图片!' }]}
                  >
                    <Input placeholder="请填写封面图片链接" />
                  </Form.Item>
                  <Form.Item label="背景音乐" name={['music', 'url']}>
                    <Input placeholder="请填写背景音乐链接" />
                  </Form.Item>
                </>
              )}
            </>
          )}
        </Form.Item>
        <Form.Item valuePropName="checked" name="hide" label="隐藏文章">
          <Switch />
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={submitting}
            style={{ padding: '0 70px' }}
          >
            SUBMIT
          </Button>
        </Form.Item>
      </Form>
    </PageContainer>
  );
};

export default ArticleInfo;

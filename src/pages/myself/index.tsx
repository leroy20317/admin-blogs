import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Button, Form, Input, message } from 'antd';
import styles from './index.less';
import { fetchMyself, postMyself } from '@/services/common';
import Editor from '@/components/Editor';
import { history } from 'umi';

const Myself: React.FC = () => {
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);

  const getMyself = () => {
    return new Promise<(value: API.Myself) => void>((resolve) => {
      setLoading(true);
      fetchMyself()
        .then((res) => {
          if (res.status === 'success') {
            resolve(res.body || {});
          }
        })
        .finally(() => {
          setTimeout(() => {
            setLoading(false);
          }, 500);
        });
    });
  };

  useEffect(() => {
    getMyself().then(({ _id: id, content, contentHtml }: any) => {
      form.setFieldsValue({
        _id: id,
        editor: {
          val: content,
          html: contentHtml,
          length: content?.length,
        },
      });
    });

    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = async ({ _id: id, editor }: any) => {
    const params = {
      _id: id,
      content: editor.val,
      contentHtml: editor.html,
    };

    console.log('params', params);

    try {
      setSubmitting(true);
      const response = await postMyself(params);
      if (response.status === 'success') {
        message.success(response.message, 1);
        setTimeout(() => {
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
      className={styles.myself}
      pageHeaderRender={() => (
        <>
          <h2 className={styles.header}>个人信息页，来让陌生人认识一下自己吧！！</h2>
        </>
      )}
    >
      <Form
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        labelAlign="left"
      >
        <Form.Item noStyle name="_id" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="editor"
          rules={[{ required: true, transform: (value) => value?.html, message: '内容不能为空!' }]}
        >
          <Editor height={600} placeholder="请填写自我介绍！" />
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

export default Myself;

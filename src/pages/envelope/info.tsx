import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Button, DatePicker, Form, message } from 'antd';
import styles from './info.less';
import { history, useSearchParams } from '@umijs/max';
import { create, fetch, update } from '@/services/envelope';
import Editor from '@/components/Editor';
import dayjs from 'dayjs';

const EnvelopeInfo: React.FC = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
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
          }, 500);
        });
    });
  };

  useEffect(() => {
    if (id) {
      getDetail().then((res: any) => {
        form.setFieldsValue({
          content: res?.content,
          time: res?.time && dayjs(res.time),
        });
      });
    }

    return () => {
      form.resetFields();
    };
  }, []);

  const onFinish = async (values: any) => {
    const params = {
      content: values.content,
      time: values.time.format('YYYY-MM-DD HH:mm:ss'),
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
          history.push('/envelope');
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
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        requiredMark={false}
        labelAlign="left"
        labelCol={{ span: 2 }}
        validateMessages={{
          // eslint-disable-next-line no-template-curly-in-string
          required: '${label}不能为空！',
        }}
      >
        <Form.Item
          label="短语内容"
          name="content"
          rules={[{ required: true, message: '请填写内容!' }]}
        >
          <Editor height={500} />
        </Form.Item>
        <Form.Item label="发布时间" name="time" required>
          <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 2 }}>
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

export default EnvelopeInfo;

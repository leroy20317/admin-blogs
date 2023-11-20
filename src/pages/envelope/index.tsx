import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Col, List, message, Popconfirm, Row, Space, Tooltip, Typography } from 'antd';
import styles from './index.less';
import { history, useModel } from '@umijs/max';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { del } from '@/services/envelope';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useEmotionCss } from '@ant-design/use-emotion-css';

const Envelope: React.FC = () => {
  const { data, getList, loading } = useModel('envelope', (model) => ({
    data: model.data,
    getList: model.getList,
    loading: model.loading,
  }));

  useEffect(() => {
    getList({});
  }, [getList]);

  const pageChange = (page: number) => {
    getList({ page });
  };

  // 编辑短语
  const edit = (id: string) => {
    history.push(`/envelope-info?id=${id}`);
  };
  // 删除短语
  const deleteItem = (id: string) => {
    del({ id }).then((res) => {
      if (res.status === 'success') {
        message.success(res.message, 1);
        pageChange(data.page || 1);
      } else {
        message.error(res.message || '删除失败', 1);
      }
    });
  };

  const iconClassName = useEmotionCss(({ token }) => {
    return {
      color: '#cfcfcf',
      cursor: 'pointer',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    };
  });

  const deleteIconClassName = useEmotionCss(({ token }) => {
    return {
      color: '#cfcfcf',
      cursor: 'pointer',
      '&:hover': {
        color: token.colorError,
      },
    };
  });

  return (
    <PageContainer
      loading={loading}
      className={styles.envelope}
      pageHeaderRender={() => <h2 className={styles.header}>短语列表 ({data?.total})</h2>}
    >
      <List
        header={
          <Row>
            <Col span={16}>
              <b>Title</b>
            </Col>
            <Col span={3} offset={1}>
              <b>Date</b>
            </Col>
            <Col span={3} offset={1}>
              <b>Actions</b>
            </Col>
          </Row>
        }
        footer={false}
        bordered={false}
        loading={loading}
        dataSource={data?.data}
        pagination={{
          hideOnSinglePage: true,
          position: 'bottom',
          current: data.page,
          pageSize: 10,
          total: data.total,
          onChange: pageChange,
        }}
        renderItem={(item) => (
          <List.Item>
            <Row>
              <Col span={16}>
                <Typography.Text ellipsis={true}>
                  {item.contentHtml.replace(/<[^>]+>/gi, '')}
                </Typography.Text>
              </Col>
              <Col span={3} offset={1}>
                {dayjs(item.time).locale('en').format('MMM DD, YYYY')}
              </Col>
              <Col span={3} offset={1}>
                <Space align="start" size="middle">
                  <Tooltip title="Edit Envelope">
                    <EditOutlined className={iconClassName} onClick={() => edit(item._id)} />
                  </Tooltip>
                  <Popconfirm
                    title="是否删除该短语?"
                    onConfirm={() => deleteItem(item._id)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <DeleteOutlined className={deleteIconClassName} />
                  </Popconfirm>
                </Space>
              </Col>
            </Row>
          </List.Item>
        )}
      />
    </PageContainer>
  );
};

export default Envelope;

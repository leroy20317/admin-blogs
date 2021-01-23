import React, { FC, useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Col, List, message, Popconfirm, Row, Space, Tooltip } from 'antd';
import styles from './index.less';
import { history, useModel } from 'umi';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import url from '@/utils/url';
import { del } from '@/services/article';
import moment from 'moment';
// import 'moment/locale/es-us';
// import locale from 'antd/es/date-picker/locale/zh_CN';

const Article: FC = () => {
  const { data, getList, loading } = useModel('article', model => ({data: model.data, getList: model.getList, loading: model.loading}));

  useEffect(() => {
    getList({});
  }, []);

  const pageChange = (page: number) => {
    getList({ page });
  };

  // 新窗口打开文章
  const view = (id: number) => {
    window.open(`${url.webHost}/${id}`);
  };
  // 编辑文章
  const edit = (id: string) => {
    history.push(`/article-info?id=${id}`);
  };
  // 删除文章
  const deleteItem = (id: string) => {
    del({ id }).then((res) => {
      if (res.status === 'success') {
        message.success(res.message, 1);
      } else {
        message.error(res.message || '删除失败', 1);
      }
    });
  };

  return (
    <PageContainer
      loading={loading}
      className={styles.article}
      pageHeaderRender={() => (
        <>
          <h2 className={styles.header}>文章列表 ({data?.total})</h2>
        </>
      )}
    >
      <List
        header={
          <Row>
            <Col span={12}>
              <b>Title</b>
            </Col>
            <Col span={4} offset={2}>
              <b>Date</b>
            </Col>
            <Col span={4} offset={2}>
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
        renderItem={item => (
          <List.Item>
            <Row>
              <Col span={12}>{item?.title}</Col>
              <Col span={4} offset={2}>
                {moment(item.time).locale('en').format('mm:ss MMM DD')}
              </Col>
              <Col span={4} offset={2}>
                <Space align="start" size="middle">
                  <Tooltip title="View Article">
                    <EyeOutlined className={styles.icon} onClick={() => view(item?.id)} />
                  </Tooltip>
                  <Tooltip title="Edit Article">
                    {/* eslint-disable-next-line no-underscore-dangle */}
                    <EditOutlined className={styles.icon} onClick={() => edit(item?._id)} />
                  </Tooltip>
                  <Popconfirm
                    title="删除该文章, 是否继续?"
                    onConfirm={
                      /* eslint-disable-next-line no-underscore-dangle */
                      () => deleteItem(item?._id)
                    }
                    okText="确定"
                    cancelText="取消"
                  >
                    <DeleteOutlined className={`${styles.icon} ${styles.delete}`} />
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

export default Article;

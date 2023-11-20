import { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Col, List, message, Popconfirm, Row, Space, Tooltip } from 'antd';
import styles from './index.less';
import { history, useModel } from '@umijs/max';
import { DeleteOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import url from '@/utils/url';
import { del } from '@/services/article';
import dayjs from 'dayjs';
import 'dayjs/locale/en';
import { useEmotionCss } from '@ant-design/use-emotion-css';
// import 'dayjs/locale/es-us';
// import locale from 'antd/es/date-picker/locale/zh_CN';

const Article: React.FC = () => {
  const { data, getList, loading } = useModel('article', (model) => ({
    data: model.data,
    getList: model.getList,
    loading: model.loading,
  }));

  useEffect(() => {
    getList({});
  }, []);

  const pageChange = (page: number) => {
    getList({ page });
  };

  // 新窗口打开文章
  const view = (id: string) => {
    window.open(`${url.webHost}/article/${id}`);
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
      className={styles.article}
      pageHeaderRender={() => <h2 className={styles.header}>文章列表 ({data?.total})</h2>}
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
        renderItem={(item) => (
          <List.Item>
            <Row>
              <Col span={12}>{item?.title}</Col>
              <Col span={4} offset={2}>
                {dayjs(item.time).locale('en').format('mm:ss MMM DD')}
              </Col>
              <Col span={4} offset={2}>
                <Space align="start" size="middle">
                  <Tooltip title="View Article">
                    <EyeOutlined className={iconClassName} onClick={() => view(item._id)} />
                  </Tooltip>
                  <Tooltip title="Edit Article">
                    <EditOutlined className={iconClassName} onClick={() => edit(item._id)} />
                  </Tooltip>
                  <Popconfirm
                    title="是否删除该文章?"
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

export default Article;

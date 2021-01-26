import React, {
  ChangeEvent,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import {
  Badge,
  Button,
  Col,
  Input,
  List,
  message,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import styles from './index.less';
import { useModel } from 'umi';
import {
  CloseCircleOutlined,
  DeleteOutlined,
  EyeOutlined,
  MessageOutlined,
  SoundOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import { del, read, replay } from '@/services/comment';
import moment from 'moment';
import url from '@/utils/url';
// import locale from 'antd/es/date-picker/locale/zh_CN';

const ReplayModal: React.ForwardRefExoticComponent<any> = forwardRef((props, ref) => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const [isShow, setIsShow] = useState(false);
  const [data, setData] = useState<API.Comment | undefined>(undefined);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const show = (comment: API.Comment) => {
    setIsShow(true);
    setData(comment);
  };

  const hide = () => {
    setIsShow(false);
    setData(undefined);
  };

  const submit = async () => {
    if (!text.trim()) {
      message.error('请填写回复内容！');
      return;
    }

    const params = {
      name: currentUser?.comment.name,
      email: currentUser?.comment.email,
      content: text,
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      image: 1,
      status: 2,
      topic_id: data?.topic_id,
      reply_name: data?.name,
      reply_email: data?.email,
      parent_id: data?.parent_id || data?.id,
      admin: true,
      type: data?.type === 1 ? 2 : 3,
    };
    try {
      setSubmitting(true);
      const response = await replay(params);
      if (response.status === 'success') {
        message.success(response.message, 1);
        setTimeout(() => {
          hide();
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

  useImperativeHandle(ref, () => ({ show }));

  return (
    <div className={`${styles.commentForm} ${isShow ? styles.active : ''}`}>
      <div className={styles.content}>
        <div className={styles.img}>
          <img src={currentUser?.admin.avatar} alt="" />
        </div>
        <p className={styles.name}>回复：{data?.name}</p>
        <Input.TextArea
          placeholder="请输入内容"
          rows={5}
          showCount
          maxLength={100}
          onChange={({ target }: ChangeEvent<HTMLTextAreaElement>) => setText(target.value)}
        />
        <div className={styles.footer}>
          <Button type="primary" onClick={submit} loading={submitting}>
            提交评论
          </Button>
          <span className={styles.tip}>
            <SoundOutlined />
            文明用语, 弘扬中华文明传统美德
          </span>
        </div>
        <CloseCircleOutlined className={styles.close} onClick={hide} />
      </div>
    </div>
  );
});

const Comment: React.FC = () => {
  const { data, getList, loading } = useModel('comment', (model) => ({
    data: model.data,
    getList: model.getList,
    loading: model.loading,
  }));

  const replayRef = useRef<any>();

  const unread = data.data.some((ele) => ele.status === 1);

  useEffect(() => {
    getList({});
  }, []);

  const pageChange = (page: number) => {
    getList({ page });
  };

  // 一键已读
  const onRead = () => {
    read().then(() => {
      pageChange(data.page || 1);
    });
  };

  // 新窗口打开文章
  const view = (topic_id: number) => {
    window.open(`${url.webHost}/${topic_id}`);
  };

  // 回复评论
  const replayComment = (comment: API.Comment) => {
    replayRef?.current.show(comment);
  };

  // 删除评论
  const deleteItem = ({ id, parent_id }: API.Comment) => {
    del({ id, parent_id }).then((res) => {
      if (res.status === 'success') {
        message.success(res.message, 1);
        pageChange(data.page || 1);
      } else {
        message.error(res.message || '删除失败', 1);
      }
    });
  };

  return (
    <PageContainer
      loading={loading}
      className={styles.comment}
      pageHeaderRender={() => (
        <h2 className={styles.header}>
          短语列表 ({data?.total})
          {unread && (
            <span className={styles.read} onClick={onRead}>
              <SyncOutlined style={{ fontSize: 14, marginRight: 5 }} />
              一键已读
            </span>
          )}
        </h2>
      )}
    >
      <List
        header={
          <Row>
            <Col span={4}>
              <b>Name</b>
            </Col>
            <Col span={11} offset={1}>
              <b>Content</b>
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
              <Col span={4}>
                <Typography.Text ellipsis={true}>
                  <Badge
                    size="small"
                    count={item.status === 1 ? 1 : 0}
                    style={{ marginRight: 3 }}
                  />
                  {item.name}
                </Typography.Text>
              </Col>
              <Col span={11} offset={1}>
                <Typography.Text ellipsis={true}>{item.content}</Typography.Text>
              </Col>
              <Col span={3} offset={1}>
                {moment(item.time).locale('en').format('HH:mm MMM DD')}
              </Col>
              <Col span={3} offset={1}>
                <Space align="start" size="middle">
                  <Tooltip title="View Article">
                    <EyeOutlined className={styles.icon} onClick={() => view(item.topic_id)} />
                  </Tooltip>
                  <Tooltip title="Replay Comment">
                    <MessageOutlined className={styles.icon} onClick={() => replayComment(item)} />
                  </Tooltip>
                  <Popconfirm
                    title={
                      item.parent_id ? '是否删除该评论?' : '当前为一级评论, 会连同子评论一块删除哦~'
                    }
                    onConfirm={() => deleteItem(item)}
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
      <ReplayModal ref={replayRef} />
    </PageContainer>
  );
};

export default Comment;

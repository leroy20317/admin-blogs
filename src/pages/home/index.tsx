import React, { useEffect } from 'react';
import { PageContainer } from '@ant-design/pro-components';
import { Card, Col, message, Row, Statistic } from 'antd';
import styles from './index.less';
import { dateDiff } from '@/utils/utils';
import { history, useModel } from '@umijs/max';
import IconFont from '@/components/IconFont';
import { useEmotionCss } from '@ant-design/use-emotion-css';
import classNames from 'classnames';

const Home: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const { currentUser } = initialState || {};
  const { info: data, getInfo, loading } = useModel('home');

  const year = new Date().getFullYear();

  useEffect(() => {
    if (!currentUser?.name) {
      // 未填写相关信息
      message.warning('请填写页面相关信息！');
      history.push('/setting');
      return;
    }
    getInfo();
  }, []);

  const primaryColor = useEmotionCss(({ token }) => {
    return {
      color: token.colorPrimary,
    };
  });

  return (
    <>
      <div className={styles.time}>
        <span>{year ? `${year}年倒计时` : '请珍惜时间'}</span>
        <Statistic.Countdown
          valueStyle={{ fontSize: 14, color: '#fff' }}
          value={new Date(year, 11, 31, 23, 59, 59).getTime()}
          format="D 天 H 时 m 分 s 秒"
        />
      </div>
      <PageContainer
        loading={loading}
        className={styles.home}
        pageHeaderRender={() => (
          <>
            <h2 className={classNames(styles.header, primaryColor)}>
              <IconFont className={classNames(styles.icon, primaryColor)} type="icon-magic-stick" />
              愿所有的美好如约而至，愿所有的黑暗都能看到希望。
            </h2>
          </>
        )}
      >
        <Row gutter={30}>
          <Col span={12}>
            <Card
              className={styles.info}
              bordered={false}
              title={
                <h4 className={styles.title}>
                  <IconFont className={styles.icon} type="icon-lollipop" />
                  Hello，你好，我是谁！
                </h4>
              }
            >
              <p className={styles.tip}>重新认识、审视、定义一下自己吧。</p>
              <ul className={styles.msg}>
                {[
                  { icon: 'icon-ice-drink', msg: '现在的你，是个怎样的人？' },
                  { icon: 'icon-lollipop', msg: '你希望以后成为怎样的人？' },
                  { icon: 'icon-lollipop', msg: '你心中的未来是怎样的？' },
                  { icon: 'icon-lollipop', msg: '最想做的一件事是什么？' },
                  { icon: 'icon-lollipop', msg: '你现在的生活，开心吗？' },
                  { icon: 'icon-hot-water', msg: '心如止水，淡中得味，加油。' },
                ].map(({ icon, msg }) => (
                  <li key={msg}>
                    <IconFont className={styles.icon} type={icon} />
                    {msg}
                  </li>
                ))}
              </ul>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<h3 className={styles.title}>article</h3>} bordered={false}>
              <p>
                <span className={styles.total}>{data?.article.length || 0}</span>
                <span>篇</span>
              </p>
              <p>
                {data?.article.last
                  ? `${dateDiff(data.article?.last.time)} 发布了新的心情，继续加油哦！`
                  : '快来发布新文章啦'}
              </p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<h3 className={styles.title}>comment</h3>} bordered={false}>
              <p>
                <span className={styles.total}>{data?.comment.length || 0}</span>
                <span>条</span>
              </p>
              <p>过去的时间里，收获了些许陌生的美好。</p>
            </Card>
          </Col>
          <Col span={12}>
            <Card title={<h3 className={styles.title}>envelope</h3>} bordered={false}>
              <div className={styles.envelope}>
                {data?.envelope?.length ? (
                  data.envelope.map(({ _id: id, contentHtml }, index) => (
                    <p className={styles.item} key={id}>
                      <span>{index + 1}</span>
                      {contentHtml.replace(/<[^>]+>/gi, '')}
                    </p>
                  ))
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      height: '80%',
                    }}
                  >
                    空空如也
                  </div>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      </PageContainer>
    </>
  );
};

export default Home;

import { CloseCircleOutlined, ExclamationCircleFilled } from '@ant-design/icons';
import { Button, Input, message } from 'antd';
import type { ChangeEvent } from 'react';
import React, { useState } from 'react';
import { history, useModel } from '@umijs/max';
import type { LoginParamsType } from '@/services/login';
import { loginIn, loginUp } from '@/services/login';

import styles from './index.less';

import login0 from '@/assets/login-0.png';
import login1 from '@/assets/login-1.png';
import login2 from '@/assets/login-2.png';

/**
 * 此方法会跳转到 redirect 参数所在的位置
 */
const goto = () => {
  if (!history) return;
  setTimeout(() => {
    const urlParams = new URL(window.location.href).searchParams;
    history.push(urlParams.get('redirect') || '/');
  }, 10);
};

const Login: React.FC = () => {
  const [submitting, setSubmitting] = useState(false);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [data, setData] = useState<LoginParamsType>({
    username: '',
    password: '',
    passwords: '',
  });
  const [isCreate, setIsCreate] = useState<boolean>(false);

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      setInitialState({
        ...initialState,
        currentUser: userInfo,
      });
    }
  };

  const handleSubmit = async () => {
    if (!data.username || !data.password) {
      message.error('请填写完整信息');
      return;
    }
    setSubmitting(true);
    try {
      // 登录
      const { status, body } = await loginIn(data);
      if (status === 'success') {
        message.success('登录成功！', 1);
        localStorage.setItem('Authorization', body.token);
        await fetchUserInfo();
        goto();
      }
    } catch (error: any) {
      message.error(error.message || '登录失败，请重试！');
    }
    setSubmitting(false);
  };

  const createSubmit = async () => {
    if (!data.username || !data.password || !data.passwords) {
      message.error('请填写完整信息');
      return;
    }
    if (data.password !== data.passwords) {
      message.error('密码不一致');
      return;
    }
    setSubmitting(true);
    try {
      // 创建账号
      const { status } = await loginUp(data);
      if (status === 'success') {
        message.success('创建账号成功，请登录！');
        setIsCreate(false);
        setData({
          username: '',
          password: '',
          passwords: '',
        });
        setSubmitting(false);
      }
    } catch (error: any) {
      message.error(error.message || '创建账号失败，请重试！');
    }
    setSubmitting(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <h2>Welcome Home!</h2>
        <div className={styles['form-item']}>
          <div className={`${styles.ipt} ${styles.user}`}>
            <Input
              placeholder="Name"
              value={data.username}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setData({ ...data, username: e.target.value })
              }
            />
            <img alt="" src={login1} />
          </div>
          <div className={`${styles.ipt} ${styles.pass}`}>
            <Input
              placeholder="Password"
              type="password"
              value={data.password}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setData({ ...data, password: e.target.value })
              }
            />
            <img alt="" src={login2} />
          </div>
          <img alt="" src={login0} />
          <Button onClick={handleSubmit} loading={submitting}>
            sign in
          </Button>
          <span className={styles.add} onClick={() => setIsCreate(true)}>
            (sign up)
          </span>
        </div>
      </div>
      <ul className={styles['bg-bubbles']}>
        {Array(10)
          .fill(1)
          .map((item, index) => (
            <li key={index + item}></li>
          ))}
      </ul>
      <div className={styles.hint}>永远相信美好的事情即将发生...</div>

      <section className={`${styles.create} ${isCreate && styles.showCreate}`}>
        <div className={styles['create-form']}>
          <h3>创建账号</h3>

          <Input
            placeholder="Username"
            value={data.username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, username: e.target.value })
            }
          />
          <Input
            placeholder="Password"
            value={data.password}
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, password: e.target.value })
            }
          />
          <Input
            placeholder="Confirm Password"
            value={data.passwords}
            type="password"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setData({ ...data, passwords: e.target.value })
            }
          />
          <Button onClick={createSubmit} loading={submitting}>
            sign in
          </Button>

          <p>
            <ExclamationCircleFilled className={styles['el-icon-warning']} />
            管理员账号只能创建一次, 请牢记账号和密码！
          </p>

          <CloseCircleOutlined
            className={styles['el-icon-circle-close']}
            onClick={() => setIsCreate(false)}
          />
        </div>
      </section>
    </div>
  );
};
export default Login;

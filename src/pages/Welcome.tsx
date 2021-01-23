import React, { useEffect, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Alert, Typography } from 'antd';
import { useIntl, FormattedMessage } from 'umi';
import styles from './Welcome.less';
import Vditor from 'vditor';
import "vditor/dist/index.css"

const CodePreview: React.FC = ({ children }) => (
  <pre className={styles.pre}>
    <code>
      <Typography.Text copyable>{children}</Typography.Text>
    </code>
  </pre>
);



export default (): React.ReactNode => {
  const intl = useIntl();
  const [vditorEditor, setVditor] = useState<any>(null)

  useEffect(() => {
    const vditor = new Vditor('vditor', {
      height: 360,
      toolbarConfig: {
        pin: true,
      },
      cache: {
        enable: false,
      },
      after () {
        vditor.setValue('Hello, Vditor + React!')
      },
    })
    setVditor(vditor)
  }, [])

  return (
    <PageContainer>
      <Card>
        <Alert
          message={intl.formatMessage({
            id: 'pages.welcome.alertMessage',
            defaultMessage: '更快更强的重型组件，已经发布。',
          })}
          type="success"
          showIcon
          banner
          style={{
            margin: -12,
            marginBottom: 24,
          }}
        />
        <div id='vditor' />
        <Typography.Text strong>
          <FormattedMessage id="pages.welcome.advancedComponent" defaultMessage="高级表格" />{' '}
          <a
            href="https://procomponents.ant.design/components/table"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-table</CodePreview>
        <Typography.Text
          strong
          style={{
            marginBottom: 12,
          }}
        >
          <FormattedMessage id="pages.welcome.advancedLayout" defaultMessage="高级布局" />{' '}
          <a
            href="https://procomponents.ant.design/components/layout"
            rel="noopener noreferrer"
            target="__blank"
          >
            <FormattedMessage id="pages.welcome.link" defaultMessage="欢迎使用" />
          </a>
        </Typography.Text>
        <CodePreview>yarn add @ant-design/pro-layout</CodePreview>
      </Card>
    </PageContainer>
  );
};

import { Settings as LayoutSettings } from '@ant-design/pro-layout';

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#1890ff',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  title: 'admin for blogs',
  pwa: false,
  logo: undefined,
  iconfontUrl: '//at.alicdn.com/t/c/font_2341199_mke80l94vni.js',
};

export default Settings;

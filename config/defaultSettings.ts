import { ProLayoutProps } from '@ant-design/pro-components';

/**
 * @name
 */
const Settings: ProLayoutProps & {
  pwa?: boolean;
  logo?: string;
} = {
  navTheme: 'light',
  layout: 'side',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: false,
  colorWeak: false,
  title: 'admin for blogs',
  pwa: false,
  logo: undefined,
  iconfontUrl: '//at.alicdn.com/t/c/font_2341199_mke80l94vni.js',
  token: {
    // 参见ts声明，demo 见文档，通过token 修改样式
    //https://procomponents.ant.design/components/layout#%E9%80%9A%E8%BF%87-token-%E4%BF%AE%E6%94%B9%E6%A0%B7%E5%BC%8F
    colorPrimary: '#0e8bff',
    sider: {
      colorMenuBackground: '#0e8bff',
      colorMenuItemDivider: 'rgba(255,255,255,0.15)',
      colorBgMenuItemHover: 'rgba(0,0,0,0.06)',
      colorBgMenuItemSelected: 'rgba(0,0,0,0.15)',
      colorTextMenuSelected: '#fff',
      colorTextMenuItemHover: 'rgba(255,255,255,0.75)',
      colorTextMenu: 'rgba(255,255,255,0.75)',
      colorTextMenuSecondary: 'rgba(255,255,255,0.65)',
      colorTextMenuTitle: 'rgba(255,255,255,0.95)',
      colorTextMenuActive: 'rgba(255,255,255,0.95)',
      colorTextSubMenuSelected: '#fff',
    },
  },
};

export default Settings;

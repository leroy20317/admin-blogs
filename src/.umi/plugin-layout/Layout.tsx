// @ts-nocheck
import React, { useState, useEffect } from "react";
import { ApplyPluginsType, useModel , useIntl } from "umi";
import { plugin } from "../core/umiExports";
import LayoutComponent from './layout/layout/index.tsx';

export default props => {
  const [runtimeConfig, setRuntimeConfig] = useState(null);

  const initialInfo = (useModel && useModel("@@initialState")) || {
    initialState: undefined,
    loading: false,
    setInitialState: null
  }; // plugin-initial-state 未开启

  

  useEffect(() => {
    const useRuntimeConfig =
      plugin.applyPlugins({
        key: "layout",
        type: ApplyPluginsType.modify,
        initialValue: {
          ...initialInfo,
          
        },
      }) || {};
    if (useRuntimeConfig instanceof Promise) {
      useRuntimeConfig.then((config) => {
        setRuntimeConfig(config);
      });
      return;
    }
    setRuntimeConfig(useRuntimeConfig);
  }, [initialInfo?.initialState, ]);

  const userConfig = {
    ...{'name':'Leroy','theme':'PRO','locale':true,'showBreadcrumb':true,'siderWidth':208,'navTheme':'light','primaryColor':'#1890ff','layout':'side','contentWidth':'Fluid','fixedHeader':false,'fixSiderbar':false,'colorWeak':false,'title':'admin for blogs','pwa':false,'iconfontUrl':'//at.alicdn.com/t/font_2341199_zo7uq67jsvq.js'},
    ...runtimeConfig || {}
  };

  const { formatMessage } = useIntl();

  if(!runtimeConfig){
    return null
  }

  return React.createElement(LayoutComponent, {
    userConfig,
    formatMessage,
    ...props
  });
};

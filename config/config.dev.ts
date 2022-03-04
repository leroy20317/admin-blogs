// https://umijs.org/config/
import { defineConfig } from 'umi';

export default defineConfig({
  plugins: [
    // https://github.com/zthxxx/react-dev-inspector
    'react-dev-inspector/plugins/umi/react-inspector',
  ],
  // https://github.com/zthxxx/react-dev-inspector#inspector-loader-props
  inspectorConfig: {
    exclude: [],
    babelPlugins: [],
    babelOptions: {},
  },
  publicPath: `/`,
  mfsu: {},
  // styles: [`/dist/vditor/dist/index.css`],
  devServer: {
    port: 5002,
    host: 'local.leroy.net.cn',
  },
});

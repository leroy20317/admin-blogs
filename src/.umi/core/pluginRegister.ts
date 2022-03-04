// @ts-nocheck
import { plugin } from './plugin';
import * as Plugin_0 from '/Users/leroy/work/demo/admin-blogs/src/app.tsx';
import * as Plugin_1 from '@@/plugin-antd-icon-config/app.ts';
import * as Plugin_2 from '../plugin-initial-state/runtime';
import * as Plugin_3 from '/Users/leroy/work/demo/admin-blogs/src/.umi/plugin-locale/runtime.tsx';
import * as Plugin_4 from '@@/plugin-layout/runtime.tsx';
import * as Plugin_5 from '../plugin-model/runtime';

  plugin.register({
    apply: Plugin_0,
    path: '/Users/leroy/work/demo/admin-blogs/src/app.tsx',
  });
  plugin.register({
    apply: Plugin_1,
    path: '@@/plugin-antd-icon-config/app.ts',
  });
  plugin.register({
    apply: Plugin_2,
    path: '../plugin-initial-state/runtime',
  });
  plugin.register({
    apply: Plugin_3,
    path: '/Users/leroy/work/demo/admin-blogs/src/.umi/plugin-locale/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_4,
    path: '@@/plugin-layout/runtime.tsx',
  });
  plugin.register({
    apply: Plugin_5,
    path: '../plugin-model/runtime',
  });

export const __mfsu = 1;

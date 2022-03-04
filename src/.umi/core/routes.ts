// @ts-nocheck
import React from 'react';
import { ApplyPluginsType, dynamic } from '/Users/leroy/work/demo/admin-blogs/node_modules/@umijs/runtime';
import * as umiExports from './umiExports';
import { plugin } from './plugin';
import LoadingComponent from '@ant-design/pro-layout/es/PageLoading';

export function getRoutes() {
  const routes = [
  {
    "path": "/",
    "component": dynamic({ loader: () => import(/* webpackChunkName: '.umi__plugin-layout__Layout' */'/Users/leroy/work/demo/admin-blogs/src/.umi/plugin-layout/Layout.tsx'), loading: LoadingComponent}),
    "routes": [
      {
        "path": "/user",
        "layout": false,
        "routes": [
          {
            "path": "/user",
            "routes": [
              {
                "name": "login",
                "path": "/user/login",
                "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__user__Login' */'/Users/leroy/work/demo/admin-blogs/src/pages/user/Login'), loading: LoadingComponent}),
                "exact": true
              }
            ]
          },
          {
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/leroy/work/demo/admin-blogs/src/pages/404'), loading: LoadingComponent}),
            "exact": true
          }
        ]
      },
      {
        "path": "/home",
        "name": "home",
        "icon": "icon-sunny",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__home__index' */'/Users/leroy/work/demo/admin-blogs/src/pages/home/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/article",
        "name": "article",
        "icon": "icon-cloudy-and-sunny",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__article__index' */'/Users/leroy/work/demo/admin-blogs/src/pages/article/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/article-info",
        "name": "article.info",
        "icon": "icon-partly-cloudy",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__article__info' */'/Users/leroy/work/demo/admin-blogs/src/pages/article/info'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/envelope",
        "name": "envelope",
        "icon": "icon-heavy-rain",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__envelope__index' */'/Users/leroy/work/demo/admin-blogs/src/pages/envelope/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/envelope-info",
        "name": "envelope.info",
        "icon": "icon-light-rain",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__envelope__info' */'/Users/leroy/work/demo/admin-blogs/src/pages/envelope/info'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/myself",
        "name": "myself",
        "icon": "icon-sunset",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__myself__index' */'/Users/leroy/work/demo/admin-blogs/src/pages/myself/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/setting",
        "name": "setting",
        "icon": "icon-moon-night",
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__setting__index' */'/Users/leroy/work/demo/admin-blogs/src/pages/setting/index'), loading: LoadingComponent}),
        "exact": true
      },
      {
        "path": "/index.html",
        "redirect": "/home",
        "exact": true
      },
      {
        "path": "/",
        "redirect": "/home",
        "exact": true
      },
      {
        "component": dynamic({ loader: () => import(/* webpackChunkName: 'p__404' */'/Users/leroy/work/demo/admin-blogs/src/pages/404'), loading: LoadingComponent}),
        "exact": true
      }
    ]
  }
];

  // allow user to extend routes
  plugin.applyPlugins({
    key: 'patchRoutes',
    type: ApplyPluginsType.event,
    args: { routes },
  });

  return routes;
}

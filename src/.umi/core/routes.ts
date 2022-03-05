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
        "path": "/~demos/:uuid",
        "layout": false,
        "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout'), loading: LoadingComponent})],
        "component": ((props) => dynamic({
          loader: async () => {
            const React = await import('react');
            const { default: getDemoRenderArgs } = await import(/* webpackChunkName: 'dumi_demos' */ '/Users/leroy/work/demo/admin-blogs/node_modules/@umijs/preset-dumi/lib/plugins/features/demo/getDemoRenderArgs');
            const { default: Previewer } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi-theme-default/es/builtins/Previewer.js');
            const { usePrefersColor, context } = await import(/* webpackChunkName: 'dumi_demos' */ 'dumi/theme');

            return props => {
              
      const { demos } = React.useContext(context);
      const [renderArgs, setRenderArgs] = React.useState([]);

      // update render args when props changed
      React.useLayoutEffect(() => {
        setRenderArgs(getDemoRenderArgs(props, demos));
      }, [props.match.params.uuid, props.location.query.wrapper, props.location.query.capture]);

      // for listen prefers-color-schema media change in demo single route
      usePrefersColor();

      switch (renderArgs.length) {
        case 1:
          // render demo directly
          return renderArgs[0];

        case 2:
          // render demo with previewer
          return React.createElement(
            Previewer,
            renderArgs[0],
            renderArgs[1],
          );

        default:
          return `Demo ${props.match.params.uuid} not found :(`;
      }
    
            }
          },
          loading: () => null,
        }))()
      },
      {
        "path": "/_demos/:uuid",
        "redirect": "/~demos/:uuid"
      },
      {
        "__dumiRoot": true,
        "layout": false,
        "path": "/~docs",
        "wrappers": [dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'../dumi/layout'), loading: LoadingComponent}), dynamic({ loader: () => import(/* webpackChunkName: 'wrappers' */'/Users/leroy/work/demo/admin-blogs/node_modules/dumi-theme-default/es/layout.js'), loading: LoadingComponent})],
        "routes": [
          {
            "path": "/~docs",
            "component": dynamic({ loader: () => import(/* webpackChunkName: 'README.md' */'/Users/leroy/work/demo/admin-blogs/README.md'), loading: LoadingComponent}),
            "exact": true,
            "meta": {
              "locale": "en-US",
              "order": null,
              "filePath": "README.md",
              "updatedTime": 1646382048000,
              "slugs": [
                {
                  "depth": 2,
                  "value": "Environment Prepare",
                  "heading": "environment-prepare"
                },
                {
                  "depth": 2,
                  "value": "Provided Scripts",
                  "heading": "provided-scripts"
                },
                {
                  "depth": 3,
                  "value": "Start project",
                  "heading": "start-project"
                },
                {
                  "depth": 3,
                  "value": "Build project",
                  "heading": "build-project"
                },
                {
                  "depth": 3,
                  "value": "Check code style",
                  "heading": "check-code-style"
                },
                {
                  "depth": 3,
                  "value": "Test code",
                  "heading": "test-code"
                },
                {
                  "depth": 2,
                  "value": "Description",
                  "heading": "description"
                }
              ],
              "title": "Environment Prepare"
            },
            "title": "Environment Prepare"
          }
        ],
        "title": "admin-blogs",
        "component": (props) => props.children
      },
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

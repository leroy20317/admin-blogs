export default [
  {
    path: '/user',
    layout: false,
    routes: [
      {
        path: '/user',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            component: './user/Login',
          },
        ],
      },
      {
        component: './404',
      },
    ],
  },
  {
    path: '/home',
    name: 'home',
    icon: 'icon-sunny',
    component: './home/index',
  },

  {
    path: '/article',
    name: 'article',
    icon: 'icon-cloudy-and-sunny',
    component: './article/index',
  },
  {
    path: '/article-info',
    name: 'article.info',
    icon: 'icon-partly-cloudy',
    component: './article/info',
  },

  {
    path: '/envelope',
    name: 'envelope',
    icon: 'icon-heavy-rain',
    component: './envelope/index',
  },
  {
    path: '/envelope-info',
    name: 'envelope.info',
    icon: 'icon-light-rain',
    component: './envelope/info',
  },

  // {
  //   path: '/comment',
  //   name: 'comment',
  //   icon: 'icon-lightning',
  //   component: './comment/index',
  // },

  {
    path: '/myself',
    name: 'myself',
    icon: 'icon-sunset',
    component: './myself/index',
  },

  {
    path: '/setting',
    name: 'setting',
    icon: 'icon-moon-night',
    component: './setting/index',
  },

  {
    path: '/',
    redirect: '/home',
  },
  {
    component: './404',
  },
];
